import bcrypt from "bcryptjs";

/**
 * Criptografa uma senha usando bcrypt.
 * @param {string} password - A senha a ser criptografada.
 * @returns {Promise<string>} - A senha criptografada.
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compara uma senha em texto com uma senha criptografada.
 * @param {string} password - A senha em texto.
 * @param {string} hashedPassword - A senha já criptografada.
 * @returns {Promise<boolean>} - Retorna true se as senhas coincidirem.
 */
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
