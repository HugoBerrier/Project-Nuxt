import OpenAI from 'openai'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{
    ingredients: string
    constraints?: string
    preferences?: string
  }>(event)

  if (!config.openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Clé OpenAI manquante côté serveur.'
    })
  }

  const client = new OpenAI({
    apiKey: config.openaiApiKey
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
    const completion = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt
    })

    const rawText = completion.output[0].content[0]?.text?.value ?? ''
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
      statusMessage: 'Erreur lors de la génération de la recette.'
    })
  }
})

