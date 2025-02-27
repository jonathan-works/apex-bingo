export class DocumentValidator {
  static validarCPF(cpf: string) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^0-9]/g, '');

    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
      return 'CPF inválido';
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) {
      return 'CPF inválido';
    }

    // Valida os dígitos verificadores
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
      return 'CPF inválido';
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
      return 'CPF inválido';
    }

    return true;
  }

  static validarCNPJ(cnpj: string) {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^0-9]/g, '');

    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) {
      return 'CNPJ inválido';
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) {
      return 'CNPJ inválido';
    }

    // Valida os dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
      return 'CNPJ inválido';
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
      return 'CNPJ inválido';
    }

    return true;
  }
}
