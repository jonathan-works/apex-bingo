export function formatarTelefone(telefone: string): string {
  if (!telefone) return '';

  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');

  // Aplica a máscara (##) #####-####
  return numeros.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}


export function formatarDocumento(doc: string) {
  if (!doc) return '';

  // Remove caracteres não numéricos
  const nums = doc.replace(/[^0-9]/g, '');

  // CPF
  if (nums.length === 11) {
    return nums.replace(/([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/g, '$1.$2.$3-$4');
  }

  // CNPJ
  if (nums.length === 14) {
    return nums.replace(/([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})/g, '$1.$2.$3/$4-$5');
  }

  return doc;
}
