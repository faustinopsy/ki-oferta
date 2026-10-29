// Funções pequenas de formatação, usadas por várias telas.

// 13.49 -> "R$ 13,49"
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// 0.9 -> "0,9 km"
function formatarDistancia(km) {
  return `${km.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`
}

// 3 -> "há 3 horas"   48 -> "há 2 dias"
function tempoAtras(horas) {
  if (horas < 1) return 'agora há pouco'
  if (horas < 24) return `há ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.floor(horas / 24)
  return `há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
}

// "13,49" ou "13.49" -> 13.49     texto inválido -> NaN
function lerPreco(texto) {
  const limpo = texto.trim().replace(/\s/g, '').replace('R$', '')
  if (!/^\d+([.,]\d{1,2})?$/.test(limpo)) {
    return NaN
  }
  return Number(limpo.replace(',', '.'))
}

// "Café" -> "cafe": compara sem acento e sem maiúscula
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

// Texto que veio de fora (endereço, formulário, API) entra no HTML assim.
// "<b>" vira "&lt;b&gt;": aparece como texto e não vira código na tela.
function escapar(texto) {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export { formatarPreco, formatarDistancia, tempoAtras, lerPreco, normalizarTexto, escapar }
