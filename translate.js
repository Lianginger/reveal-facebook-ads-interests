module.exports = async function translate(
  textToTranslate,
  projectId = process.env.GOOGLE_PROJECTID // Your GCP Project Id
) {
  // Imports the Google Cloud client library
  const { Translate } = require('@google-cloud/translate')

  // Instantiates a client
  const translate = new Translate({ projectId })

  // The text to translate
  const text = textToTranslate

  // The target language
  const target = 'en'

  // Translates some text into English
  const [translation] = await translate.translate(text, target)
  console.log(`Text: ${text}`)
  console.log(`Translation: ${translation}`)
  return translation
}
