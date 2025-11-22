/**
 * Perfil del dueño de Fuxion Shop
 * Este perfil se usa cuando TÚ escribes en el foro
 */

export const OWNER_PROFILE = {
  name: 'Fuxion Shop',
  avatar: '🏪',
  verified: true,
  isOwner: true,
  isModerator: true
};

/**
 * Verifica si un usuario es el dueño
 */
export const isOwner = (authorName) => {
  return authorName === OWNER_PROFILE.name || authorName === 'Fuxion Shop';
};

/**
 * Verifica si un usuario puede moderar
 */
export const canModerate = (authorName) => {
  return isOwner(authorName);
};

export default OWNER_PROFILE;
