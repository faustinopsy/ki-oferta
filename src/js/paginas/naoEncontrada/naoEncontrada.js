import { vazio } from '../../componentes/vazio/vazio.js'
import { escapar } from '../../util/formatos.js'

// Endereço que não está no mapa de rotas. O main.js chama esta tela
// quando o find não acha a rota; por isso ela não entra em mapaderotas.
function naoEncontrada(app) {
  const endereco = window.location.hash.split('?')[0]
  app.innerHTML = `
    <section class="tela">
      ${vazio({
        icone: 'map-pin-off',
        titulo: 'Tela não encontrada',
        texto: `O endereço ${escapar(endereco)} não existe no KiOferta.`,
        acao: { href: '#buscar', texto: 'Voltar para a busca' },
      })}
    </section>`
}

export default {
  url: '#404',
  label: '',
  icon: 'map-pin-off',
  pagina: naoEncontrada,
}
