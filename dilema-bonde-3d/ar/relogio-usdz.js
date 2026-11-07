import { PONTEIROS, PERIODOS } from '../js/relogio.js?v=20261107-ra7';

// Quick Look não lê a hora do sistema dentro de um USDZ estático. Os três
// ponteiros avançam em tempo real a partir da pose salva, independentemente
// dos botões do bonde. O arquivo gerado no celular começa na hora do preparo.
export function comportamentoRelogio(caminho) {
  return `
  def Preliminary_Behavior "Relogio_Continuo"
  {
    rel triggers = <Inicio>
    rel actions = <Ponteiros>
    uniform bool exclusive = 0
    def Preliminary_Trigger "Inicio"
    {
      token info:id = "SceneTransition"
      token type = "enter"
    }
    def Preliminary_Action "Ponteiros"
    {
      token info:id = "Group"
      token type = "parallel"
      bool loops = 0
      int performCount = 1
      rel actions = [<Ciclo_0>, <Ciclo_1>, <Ciclo_2>]
      ${PONTEIROS.map((nome,i)=>`
      def Preliminary_Action "Ciclo_${i}"
      {
        token info:id = "Group"
        token type = "serial"
        bool loops = 1
        int performCount = 1
        rel actions = <Girar>
        def Preliminary_Action "Girar"
        {
          token info:id = "Spin"
          rel affectedObjects = <${caminho(nome)}>
          double duration = ${PERIODOS[i]}
          double revolutions = 1
          vector3d axis = (0, 0, -1)
        }
      }`).join('\n')}
    }
  }`;
}
