// Dados de exemplo do KiOferta.
// As telas não importam este arquivo: elas pedem aos serviços (pasta servicos).
// Quando a API ficar pronta, só os serviços mudam; as telas continuam iguais.

const semana = {
  inicio: '10/08',
  texto: 'semana de 10 a 16 de agosto',
  fim: 'domingo, 16 de agosto',
}

const categorias = [
  { nome: 'Mercearia', icone: 'wheat' },
  { nome: 'Carnes', icone: 'beef' },
  { nome: 'Hortifrúti', icone: 'apple' },
  { nome: 'Bebidas', icone: 'cup-soda' },
  { nome: 'Limpeza', icone: 'spray-can' },
  { nome: 'Higiene', icone: 'bath' },
]

// imagem vazia: a miniatura mostra o ícone da categoria no lugar da foto
const produtos = [
  { id: 1, nome: 'Café Serra Azul Torrado e Moído 500 g', categoria: 'Mercearia', codigo: '7891234567890', imagem: '' },
  { id: 2, nome: 'Café Bom Dia Tradicional 500 g', categoria: 'Mercearia', codigo: '7891234567012', imagem: '' },
  { id: 3, nome: 'Café Serra Azul Extraforte 500 g', categoria: 'Mercearia', codigo: '7891234567029', imagem: '' },
  { id: 4, nome: 'Café Solúvel Manhã Clara 200 g', categoria: 'Mercearia', codigo: '7891234567036', imagem: '' },
  { id: 5, nome: 'Café Serra Azul em Cápsulas 10 un', categoria: 'Mercearia', codigo: '7891234567043', imagem: '' },
  { id: 6, nome: 'Arroz Vale Verde Tipo 1 5 kg', categoria: 'Mercearia', codigo: '7891234567050', imagem: '' },
  { id: 7, nome: 'Feijão Carioca Grão Bom 1 kg', categoria: 'Mercearia', codigo: '7891234567067', imagem: '' },
  { id: 8, nome: 'Óleo de Soja Girassol Dourado 900 ml', categoria: 'Mercearia', codigo: '7891234567074', imagem: '' },
  { id: 9, nome: 'Leite Integral Campo Belo 1 L', categoria: 'Mercearia', codigo: '7891234567081', imagem: '' },
  { id: 10, nome: 'Refrigerante Guaraná Tropical 2 L', categoria: 'Bebidas', codigo: '7891234567098', imagem: '' },
  { id: 11, nome: 'Suco Integral de Uva Vinha 1 L', categoria: 'Bebidas', codigo: '7891234567104', imagem: '' },
  { id: 12, nome: 'Patinho Bovino Moído 1 kg', categoria: 'Carnes', codigo: '2000000000121', imagem: '' },
  { id: 13, nome: 'Peito de Frango Congelado 1 kg', categoria: 'Carnes', codigo: '7891234567111', imagem: '' },
  { id: 14, nome: 'Banana Prata 1 kg', categoria: 'Hortifrúti', codigo: '2000000000145', imagem: '' },
  { id: 15, nome: 'Tomate Italiano 1 kg', categoria: 'Hortifrúti', codigo: '2000000000152', imagem: '' },
  { id: 16, nome: 'Detergente Limpa Tudo 500 ml', categoria: 'Limpeza', codigo: '7891234567128', imagem: '' },
  { id: 17, nome: 'Sabão em Pó Brilho Real 1,6 kg', categoria: 'Limpeza', codigo: '7891234567135', imagem: '' },
  { id: 18, nome: 'Sabonete Flor do Campo 85 g', categoria: 'Higiene', codigo: '7891234567142', imagem: '' },
  { id: 19, nome: 'Creme Dental Sorriso 90 g', categoria: 'Higiene', codigo: '7891234567159', imagem: '' },
]

// distanciaKm: distância até quem usa o app (o GPS de verdade entra depois)
// lat e lng: posição do mercado no mapa
const mercados = [
  { id: 1, nome: 'Supermercado Andorinha', curto: 'Andorinha', endereco: 'Rua das Palmeiras, 480', bairro: 'Vila Nova', distanciaKm: 0.9, lat: -21.7555, lng: -43.3457 },
  { id: 2, nome: 'Mercadão Vila Rica', curto: 'Vila Rica', endereco: 'Av. Sete de Setembro, 1210', bairro: 'Costa Carvalho', distanciaKm: 1.7, lat: -21.7760, lng: -43.3577 },
  { id: 3, nome: 'Supermercado Serrano', curto: 'Serrano', endereco: 'Av. Rio Branco, 2900', bairro: 'Bom Pastor', distanciaKm: 1.2, lat: -21.7600, lng: -43.3625 },
  { id: 4, nome: 'Mercado Dona Lúcia', curto: 'Dona Lúcia', endereco: 'Rua Ipiranga, 302', bairro: 'São Mateus', distanciaKm: 2.6, lat: -21.7790, lng: -43.3335 },
  { id: 5, nome: 'Atacarejo Bom Preço', curto: 'Bom Preço', endereco: 'Rua Halfeld, 85', bairro: 'Centro', distanciaKm: 3.4, lat: -21.7330, lng: -43.3403 },
]

// onde está quem usa o app (centro do mapa)
const posicaoDoUsuario = { lat: -21.7620, lng: -43.3510 }

// status: pendente | aprovado        perfil: contribuidor | moderador
// horasAtras: há quanto tempo a conta foi pedida
const usuarios = [
  { id: 1, nome: 'Marina R.', email: 'marina@kioferta.com', senha: 'marina123', cidade: 'Juiz de Fora, MG', reputacao: 128, status: 'aprovado', perfil: 'contribuidor', desde: 'maio', horasAtras: 2400 },
  { id: 2, nome: 'Caio M.', email: 'caio@kioferta.com', senha: 'caio1234', cidade: 'Juiz de Fora, MG', reputacao: 340, status: 'aprovado', perfil: 'moderador', desde: 'março', horasAtras: 3600 },
  { id: 3, nome: 'Rafael T.', email: 'rafael@kioferta.com', senha: 'rafael123', cidade: 'Juiz de Fora, MG', reputacao: 212, status: 'aprovado', perfil: 'contribuidor', desde: 'abril', horasAtras: 3000 },
  { id: 4, nome: 'Bruna S.', email: 'bruna@kioferta.com', senha: 'bruna123', cidade: 'Juiz de Fora, MG', reputacao: 86, status: 'aprovado', perfil: 'contribuidor', desde: 'junho', horasAtras: 1500 },
  { id: 5, nome: 'Marcos Vinícius Alves', email: 'marcos@email.com', senha: 'marcos123', cidade: 'Juiz de Fora, MG', reputacao: 0, status: 'pendente', perfil: 'contribuidor', desde: 'agosto', horasAtras: 48 },
  { id: 6, nome: 'Juliana Prado Fonseca', email: 'juliana@email.com', senha: 'juliana123', cidade: 'Juiz de Fora, MG', reputacao: 0, status: 'pendente', perfil: 'contribuidor', desde: 'agosto', horasAtras: 24 },
  { id: 7, nome: 'Sandro Kühn', email: 'sandro@email.com', senha: 'sandro123', cidade: 'Matias Barbosa, MG', reputacao: 0, status: 'pendente', perfil: 'contribuidor', desde: 'agosto', horasAtras: 18 },
]

// status: votacao | aprovada | rejeitada | expirada
// foto: endereço da foto da etiqueta ('' = ainda sem foto)
const ofertas = [
  { id: 1, produtoId: 1, mercadoId: 1, preco: 13.49, autorId: 1, horasAtras: 48, confirmacoes: 8, status: 'aprovada', soCartao: false, foto: '' },
  { id: 2, produtoId: 1, mercadoId: 2, preco: 14.90, autorId: 3, horasAtras: 30, confirmacoes: 5, status: 'aprovada', soCartao: false, foto: '' },
  { id: 3, produtoId: 1, mercadoId: 3, preco: 16.75, autorId: 4, horasAtras: 60, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 4, produtoId: 1, mercadoId: 5, preco: 18.99, autorId: 4, horasAtras: 10, confirmacoes: 1, status: 'votacao', soCartao: false, foto: '' },
  { id: 5, produtoId: 2, mercadoId: 3, preco: 12.89, autorId: 3, horasAtras: 20, confirmacoes: 6, status: 'aprovada', soCartao: true, foto: '' },
  { id: 6, produtoId: 2, mercadoId: 1, preco: 14.50, autorId: 4, horasAtras: 52, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 7, produtoId: 2, mercadoId: 4, preco: 15.90, autorId: 3, horasAtras: 70, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 8, produtoId: 2, mercadoId: 2, preco: 16.99, autorId: 2, horasAtras: 75, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 9, produtoId: 3, mercadoId: 2, preco: 14.20, autorId: 3, horasAtras: 26, confirmacoes: 5, status: 'aprovada', soCartao: false, foto: '' },
  { id: 10, produtoId: 3, mercadoId: 5, preco: 16.50, autorId: 4, horasAtras: 40, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 11, produtoId: 3, mercadoId: 4, preco: 18.00, autorId: 2, horasAtras: 90, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 12, produtoId: 4, mercadoId: 5, preco: 18.49, autorId: 3, horasAtras: 33, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 13, produtoId: 4, mercadoId: 4, preco: 20.49, autorId: 4, horasAtras: 58, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 14, produtoId: 5, mercadoId: 5, preco: 19.90, autorId: 3, horasAtras: 44, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 15, produtoId: 5, mercadoId: 2, preco: 25.99, autorId: 2, horasAtras: 80, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 16, produtoId: 6, mercadoId: 1, preco: 22.90, autorId: 1, horasAtras: 26, confirmacoes: 5, status: 'aprovada', soCartao: false, foto: '' },
  { id: 17, produtoId: 6, mercadoId: 3, preco: 24.50, autorId: 3, horasAtras: 50, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 18, produtoId: 6, mercadoId: 5, preco: 21.99, autorId: 4, horasAtras: 6, confirmacoes: 2, status: 'votacao', soCartao: true, foto: '' },
  { id: 19, produtoId: 7, mercadoId: 1, preco: 7.49, autorId: 4, horasAtras: 36, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 20, produtoId: 7, mercadoId: 2, preco: 8.29, autorId: 3, horasAtras: 66, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 21, produtoId: 7, mercadoId: 4, preco: 6.99, autorId: 2, horasAtras: 22, confirmacoes: 5, status: 'aprovada', soCartao: false, foto: '' },
  { id: 22, produtoId: 8, mercadoId: 2, preco: 5.99, autorId: 1, horasAtras: 144, confirmacoes: 0, status: 'rejeitada', motivo: '3 contestações: preço divergente', soCartao: false, foto: '' },
  { id: 23, produtoId: 8, mercadoId: 3, preco: 7.89, autorId: 3, horasAtras: 30, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 24, produtoId: 8, mercadoId: 5, preco: 7.29, autorId: 4, horasAtras: 46, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 25, produtoId: 9, mercadoId: 1, preco: 4.29, autorId: 1, horasAtras: 3, confirmacoes: 2, status: 'votacao', soCartao: false, foto: '' },
  { id: 26, produtoId: 9, mercadoId: 4, preco: 4.79, autorId: 3, horasAtras: 28, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 27, produtoId: 9, mercadoId: 3, preco: 4.99, autorId: 2, horasAtras: 54, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 28, produtoId: 10, mercadoId: 3, preco: 6.99, autorId: 3, horasAtras: 18, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 29, produtoId: 10, mercadoId: 5, preco: 5.89, autorId: 4, horasAtras: 40, confirmacoes: 4, status: 'aprovada', soCartao: true, foto: '' },
  { id: 30, produtoId: 10, mercadoId: 1, preco: 7.49, autorId: 2, horasAtras: 62, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 31, produtoId: 11, mercadoId: 2, preco: 12.90, autorId: 3, horasAtras: 34, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 32, produtoId: 11, mercadoId: 1, preco: 14.90, autorId: 4, horasAtras: 70, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 33, produtoId: 12, mercadoId: 4, preco: 39.90, autorId: 2, horasAtras: 20, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 34, produtoId: 12, mercadoId: 1, preco: 42.90, autorId: 3, horasAtras: 44, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 35, produtoId: 12, mercadoId: 5, preco: 36.99, autorId: 4, horasAtras: 12, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 36, produtoId: 13, mercadoId: 1, preco: 17.99, autorId: 3, horasAtras: 24, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 37, produtoId: 13, mercadoId: 3, preco: 15.49, autorId: 2, horasAtras: 50, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 38, produtoId: 14, mercadoId: 1, preco: 2.49, autorId: 3, horasAtras: 8, confirmacoes: 6, status: 'aprovada', soCartao: false, foto: '' },
  { id: 39, produtoId: 14, mercadoId: 2, preco: 3.29, autorId: 2, horasAtras: 30, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 40, produtoId: 14, mercadoId: 4, preco: 2.99, autorId: 4, horasAtras: 5, confirmacoes: 1, status: 'votacao', soCartao: false, foto: '' },
  { id: 41, produtoId: 15, mercadoId: 3, preco: 6.49, autorId: 3, horasAtras: 16, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 42, produtoId: 15, mercadoId: 1, preco: 7.99, autorId: 4, horasAtras: 38, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 43, produtoId: 16, mercadoId: 1, preco: 2.19, autorId: 3, horasAtras: 230, confirmacoes: 7, status: 'expirada', soCartao: false, foto: '', semana: '03/08' },
  { id: 44, produtoId: 17, mercadoId: 1, preco: 12.49, autorId: 3, horasAtras: 96, confirmacoes: 9, status: 'aprovada', soCartao: false, foto: '' },
  { id: 45, produtoId: 17, mercadoId: 5, preco: 11.90, autorId: 1, horasAtras: 220, confirmacoes: 4, status: 'expirada', soCartao: false, foto: '', semana: '03/08' },
  { id: 46, produtoId: 17, mercadoId: 2, preco: 13.99, autorId: 2, horasAtras: 60, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 47, produtoId: 18, mercadoId: 3, preco: 2.39, autorId: 4, horasAtras: 42, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 48, produtoId: 18, mercadoId: 4, preco: 1.99, autorId: 3, horasAtras: 14, confirmacoes: 4, status: 'aprovada', soCartao: false, foto: '' },
  { id: 49, produtoId: 19, mercadoId: 1, preco: 4.49, autorId: 2, horasAtras: 26, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
  { id: 50, produtoId: 19, mercadoId: 5, preco: 3.99, autorId: 3, horasAtras: 48, confirmacoes: 5, status: 'aprovada', soCartao: false, foto: '' },
  { id: 51, produtoId: 19, mercadoId: 2, preco: 4.99, autorId: 4, horasAtras: 70, confirmacoes: 3, status: 'aprovada', soCartao: false, foto: '' },
]

// Favoritos que aparecem na primeira vez que o app abre neste aparelho,
// para a tela mostrar os três casos: preço caiu, ficou igual e expirou.
const favoritosDeExemplo = [
  { produtoId: 1, precoSalvo: 15.90, semana: '03/08' },
  { produtoId: 6, precoSalvo: 21.99, semana: '03/08' },
  { produtoId: 16, precoSalvo: 2.19, semana: '03/08' },
]

export { favoritosDeExemplo, semana, categorias, produtos, mercados, posicaoDoUsuario, usuarios, ofertas }
