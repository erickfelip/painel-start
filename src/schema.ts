import * as Yup from "yup";

export const stepSchemas = [
  // =========================
  // ETAPA 1
  // =========================
  Yup.object().shape({
    idMunicipio: Yup.string().required("Municipio de cadastro é obrigatório"),
    cpf: Yup.string().required("CPF é obrigatório"),
    nis: Yup.string().required("NIS é obrigatório"),
    nome: Yup.string().required("Nome é obrigatório"),
    rg: Yup.string().required("RG é obrigatório"),
    orgao: Yup.string().required("Órgão é obrigatório"),
    estado: Yup.string().required("Estado é obrigatório"),
    dataNascimento: Yup.string().required("Data de nascimento é obrigatória"),
    emancipado: Yup.boolean().nullable(),
    estadoCivil: Yup.string().required("Estado civil é obrigatório"),
    sexo: Yup.string().required("Sexo é obrigatório"),
    email: Yup.string().email("Email inválido").required("Email é obrigatório"),
    telefone1: Yup.string().required("Telefone é obrigatório"),
    telefone2: Yup.string().nullable(),
    mae: Yup.string().required("Nome da mãe é obrigatório"),
    rendaPessoal: Yup.string()
      .typeError("Informe um número")
      .required("Renda pessoal é obrigatória"),
    chefeDeFamilia: Yup.boolean().nullable(),
    possuiDeficiencia: Yup.boolean().nullable(),
    deficiencia: Yup.string().nullable(),
    profissao: Yup.string().required("Profissão é obrigatória"),
    totalPessoas: Yup.number()
      .typeError("Informe um número")
      .required("Total de pessoas é obrigatório"),
    rendaFamiliar: Yup.string()
      .typeError("Informe um número")
      .required("Renda familiar é obrigatória"),
    condicaoMoradia: Yup.string().required("Condição moradia é obrigatória"),
    recebemBolsaFamilia: Yup.boolean().nullable(),
    deficientesNaFamilia: Yup.boolean().nullable(),
    idososNaFamilia: Yup.boolean().nullable(),
    tipoMoradia: Yup.string().required("Tipo moradia é obrigatório"),
    trabalhoOcupacao: Yup.string().required("Trabalho/Ocupação é obrigatório"),
    filhos0a6Anos: Yup.number().typeError("Informe um número").required("Campo obrigatório"),
    filhos7a18Anos: Yup.number().typeError("Informe um número").required("Campo obrigatório"),
    cep: Yup.string().required("CEP é obrigatório"),
    logradouro: Yup.string().required("Logradouro é obrigatório"),
    numero: Yup.string().required("Número é obrigatório"),
    bairro: Yup.string().required("Bairro é obrigatório"),
    cidade: Yup.string().required("Cidade é obrigatória"),
    complemento: Yup.string().required("Complemento é obrigatório"),
    localStatusInscricao: Yup.string().required(
      "Local status inscrição é obrigatório"
    ),
  }),

  // =========================
  // ETAPA 2
  // =========================
  Yup.object().shape({
    nomeConjuge: Yup.string().nullable(),
    estadoCivilConjuge: Yup.string().nullable(),
    profissaoConjuge: Yup.string().nullable(),
    rgConjuge: Yup.string().nullable(),
    cpfConjuge: Yup.string().nullable(),
    rendaConjuge: Yup.string().typeError("Informe um número").nullable(),
    possuiDeficienciaConjuge: Yup.boolean().nullable(),
    conjugeVaraoAusente: Yup.boolean().nullable(),
  }),

  // =========================
  // ETAPA 3
  // =========================
  Yup.object().shape({
    mulherResponsavelUnidadeFamiliar: Yup.boolean().nullable(),
    titularOuConjugeNegro: Yup.boolean().nullable(),
    pessoaComDeficienciaNaComposicaoFamiliar: Yup.boolean().nullable(),
    idosoNaComposicaoFamiliar: Yup.boolean().nullable(),
    criancaOuAdolescenteNaComposicaoFamiliar: Yup.boolean().nullable(),
    pessoaComCancerOuDoencaRaraCronicaDegenerativa: Yup.boolean().nullable(),
    mulherVitimaViolenciaDomestica: Yup.boolean().nullable(),
    situacaoRiscoVulnerabilidade: Yup.boolean().nullable(),
    povosTradicionaisQuilombolas: Yup.boolean().nullable(),
    residentesEmAreasDeRisco: Yup.boolean().nullable(),
    situacaoDeRuaOuTrajetoriaRua: Yup.boolean().nullable(),
  }),
];
