// Produtos, mercados e ofertas do KiOferta.
// Hoje lê os dados mockados. Quando a API da disciplina estiver no ar,
// este arquivo passa a pedir ao http.js e as telas continuam iguais.
import { semana, categorias, produtos, mercados, posicaoDoUsuario, usuarios, ofertas }
  from '../dadosMockados/dados.js'
import { normalizarTexto } from '../util/formatos.js'

// ---------- Regras do sistema ----------
const STATUS_ATIVOS = ['votacao', 'aprovada']   // o que o público vê
const CONFIRMACOES_PARA_APROVAR = 3
const REPUTACAO_SEM_VOTACAO = 200

function estaAtiva(oferta) {
  return STATUS_ATIVOS.includes(oferta.status)
}

// Troca os ids da oferta pelos objetos: a tela recebe tudo pronto.
function completar(oferta) {
  return {
    ...oferta,
    produto: produtos.find(produto => produto.id === oferta.produtoId),
    mercado: mercados.find(mercado => mercado.id === oferta.mercadoId),
    autor: usuarios.find(usuario => usuario.id === oferta.autorId),
  }
}

// Uma oferta aprovada rende 4 pontos, mais 1 por confirmação.
function pontosDaOferta(oferta) {
  return oferta.status === 'aprovada' ? 4 + oferta.confirmacoes : 0
}

// ---------- Consultas simples ----------
function semanaAtual() {
  return semana
}

function listarCategorias() {
  return categorias
}

function iconeDaCategoria(nome) {
  const categoria = categorias.find(item => item.nome === nome)
  return categoria ? categoria.icone : 'package'
}

function produtoPorId(id) {
  return produtos.find(produto => produto.id === Number(id)) || null
}

function produtoPorCodigo(codigo) {
  const numeros = codigo.replace(/\D/g, '')
  return produtos.find(produto => produto.codigo === numeros) || null
}

function mercadoPorId(id) {
  return mercados.find(mercado => mercado.id === Number(id)) || null
}

function listarMercados() {
  return [...mercados].sort((a, b) => a.distanciaKm - b.distanciaKm)
}

function posicaoAtual() {
  return posicaoDoUsuario
}

// ---------- Resumo de decisão de um produto ----------
// Responde: quanto custa no mínimo, quanto economiza e a que distância.
function resumir(produto) {
  const ativas = ofertas
    .filter(oferta => oferta.produtoId === produto.id && estaAtiva(oferta))
    .map(completar)
    .sort((a, b) => a.preco - b.preco)

  if (ativas.length === 0) {
    return { produto, ofertas: [], menor: null, maior: null, economia: 0, mercados: 0, maisPerto: null }
  }

  const precos = ativas.map(oferta => oferta.preco)
  const menor = Math.min(...precos)
  const maior = Math.max(...precos)

  return {
    produto,
    ofertas: ativas,
    menor,
    maior,
    economia: maior - menor,
    mercados: new Set(ativas.map(oferta => oferta.mercadoId)).size,
    maisPerto: Math.min(...ativas.map(oferta => oferta.mercado.distanciaKm)),
  }
}

function resumoDoProduto(id) {
  const produto = produtoPorId(id)
  return produto ? resumir(produto) : null
}

// Tela 2: filtra por texto e categoria, ordena por preço ou distância.
function buscarProdutos({ busca = '', categoria = '', ordem = 'preco' }) {
  const termo = normalizarTexto(busca)

  const resumos = produtos
    .filter(produto => categoria === '' || produto.categoria === categoria)
    .filter(produto => normalizarTexto(produto.nome).includes(termo))
    .map(resumir)
    .filter(resumo => resumo.ofertas.length > 0)   // sem oferta ativa não aparece

  if (ordem === 'distancia') {
    return resumos.sort((a, b) => a.maisPerto - b.maisPerto)
  }
  return resumos.sort((a, b) => a.menor - b.menor)
}

// ---------- Mercados ----------
function ofertasDoMercado(id) {
  return ofertas
    .filter(oferta => oferta.mercadoId === Number(id) && estaAtiva(oferta))
    .map(completar)
    .sort((a, b) => a.horasAtras - b.horasAtras)
}

// Tela 4: um marcador por mercado. Com produto, o preço é o daquele produto;
// sem produto, é o menor preço de qualquer promoção do mercado.
function mercadosNoMapa(produtoId) {
  return listarMercados()
    .map(mercado => {
      const doMercado = ofertasDoMercado(mercado.id)
      const consideradas = produtoId
        ? doMercado.filter(oferta => oferta.produtoId === Number(produtoId))
        : doMercado
      if (consideradas.length === 0) return null
      return {
        mercado,
        preco: Math.min(...consideradas.map(oferta => oferta.preco)),
        quantidade: doMercado.length,
      }
    })
    .filter(item => item !== null)
}

// ---------- Contribuições ----------
function ofertasDoAutor(usuarioId) {
  return ofertas
    .filter(oferta => oferta.autorId === usuarioId)
    .map(completar)
    .sort((a, b) => a.horasAtras - b.horasAtras)
}

function publicaDireto(usuario) {
  return usuario.perfil === 'moderador' || usuario.reputacao >= REPUTACAO_SEM_VOTACAO
}

function confirmarOferta(ofertaId, usuario) {
  const oferta = ofertas.find(item => item.id === Number(ofertaId))
  if (!oferta || !estaAtiva(oferta)) {
    throw new Error('Esta oferta não está mais ativa.')
  }
  if (oferta.autorId === usuario.id) {
    throw new Error('Você enviou esta oferta. A confirmação precisa vir de outra pessoa.')
  }
  oferta.confirmadoPor = oferta.confirmadoPor || []
  if (oferta.confirmadoPor.includes(usuario.id)) {
    throw new Error('Você já confirmou este preço.')
  }

  oferta.confirmadoPor.push(usuario.id)
  oferta.confirmacoes = oferta.confirmacoes + 1
  if (oferta.status === 'votacao' && oferta.confirmacoes >= CONFIRMACOES_PARA_APROVAR) {
    oferta.status = 'aprovada'
  }
  return completar(oferta)
}

// Produto que veio do Open Food Facts e ainda não estava no catálogo.
function cadastrarProduto({ nome, imagem, codigo, categoria }) {
  const novo = {
    id: Math.max(...produtos.map(produto => produto.id)) + 1,
    nome,
    categoria,
    codigo: codigo.replace(/\D/g, ''),
    imagem,
  }
  produtos.push(novo)
  return novo
}

function publicarOferta({ produtoId, mercadoId, preco, soCartao, foto }, autor) {
  if (!autor || autor.status !== 'aprovado') {
    throw new Error('Só contas aprovadas enviam promoções.')
  }
  if (!produtoPorId(produtoId)) {
    throw new Error('Leia o código de barras do produto.')
  }
  if (!mercadoPorId(mercadoId)) {
    throw new Error('Escolha o mercado.')
  }
  if (!(preco > 0 && preco < 10000)) {
    throw new Error('Digite o preço como está na etiqueta, por exemplo 13,49.')
  }

  const nova = {
    id: Math.max(...ofertas.map(oferta => oferta.id)) + 1,
    produtoId: Number(produtoId),
    mercadoId: Number(mercadoId),
    preco,
    autorId: autor.id,
    horasAtras: 0,
    confirmacoes: 0,
    status: publicaDireto(autor) ? 'aprovada' : 'votacao',
    soCartao,
    foto,
  }
  ofertas.push(nova)
  return completar(nova)
}

export {
  CONFIRMACOES_PARA_APROVAR, REPUTACAO_SEM_VOTACAO,
  semanaAtual, listarCategorias, iconeDaCategoria,
  produtoPorId, produtoPorCodigo, mercadoPorId, listarMercados, posicaoAtual,
  resumoDoProduto, buscarProdutos, ofertasDoMercado, mercadosNoMapa,
  ofertasDoAutor, pontosDaOferta, publicaDireto,
  confirmarOferta, cadastrarProduto, publicarOferta,
}
