import { Mistral } from '@mistralai/mistralai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{
    ingredients: string
    constraints?: string
    preferences?: string
  }>(event)

  if (!config.mistralApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Clé Mistral manquante côté serveur.'
    })
  }

  const client = new Mistral({
    apiKey: config.mistralApiKey
  })

  const prompt = `
Tu es un assistant culinaire sérieux pour des étudiants/jeunes actifs.
Génère UNE seule recette structurée avec :
- un titre court
- une liste d'ingrédients en texte brut
- des instructions étape par étape.

Ingrédients disponibles : ${body.ingredients}
Contraintes : ${body.constraints || 'non précisées'}
Préférences alimentaires : ${body.preferences || 'non précisées'}

Répond au format JSON strict :
{
  "title": "...",
  "ingredients": "liste en texte",
  "instructions": "texte avec les étapes"
}
  `.trim()

  try {
    const completion = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      responseFormat: {
        type: 'text'
      }
    })

    const content = completion.choices[0]?.message?.content
    const rawText = typeof content === 'string' ? content : Array.isArray(content) ? content.map((c: any) => c.text ?? '').join('') : ''
    const firstBrace = rawText.indexOf('{')
    const lastBrace = rawText.lastIndexOf('}')
    const jsonText = firstBrace !== -1 && lastBrace !== -1 ? rawText.slice(firstBrace, lastBrace + 1) : rawText

    const parsed = JSON.parse(jsonText)

    return {
      title: parsed.title,
      ingredients: parsed.ingredients,
      instructions: parsed.instructions
    }
  } catch (error: any) {
    console.error('Erreur API OpenAI', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || error?.error?.message || 'Erreur lors de la génération de la recette.'
    })
  }
})

