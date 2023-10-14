function generateUniqueID(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSRTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueID = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueID += characters.charAt(randomIndex);
  }

  return uniqueID;
}

export default generateUniqueID;
