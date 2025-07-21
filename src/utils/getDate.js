function getISTDate() {
  const now = new Date();
  // IST is UTC + 5 hours 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  return istTime;
}

export {getISTDate}