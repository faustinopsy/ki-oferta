import { buscarJson } from './http.js'

const CAMPOS = 'product_name,brands,image_front_small_url'

// Consulta o código de barras no Open Food Facts.
async function buscarProdutoPorCodigo(texto) {
  const codigo = texto.replace(/\D/g, '')
  if (codigo.length !== 8 && codigo.length !== 13) {
    throw new Error('O código de barras tem 8 ou 13 números.')
  }

  const url =
    `https://world.openfoodfacts.org/api/v2/product/${codigo}.json?fields=${CAMPOS}`
  const dados = await buscarJson(url)
  if (dados === null || dados.status === 0 || !dados.product?.product_name) {
    return null                                 // não cadastrado, ou sem nome
  }

  return {
    nome: dados.product.product_name,
    marca: dados.product.brands || '',
    imagem: dados.product.image_front_small_url || '',
  }
}

export { buscarProdutoPorCodigo }
