class FormularioDinamico {
  // Id do formulario
  idFormulario: number;
  // Id do chamado
  idChamado: number;
  // Status do chamado
  status: number;
  // Nome do formulario
  nomeFormulario: string;
  // Caminho do formulario
  caminhoLogo: string;
  // Data criacao
  dtCriacao: Date;
  // Lista de campos do formulario
  listaCampos: CamposDinamicos[];
  // Mapa para a construcao do formulario
  mapaCampos: Map<string, string>;
}
