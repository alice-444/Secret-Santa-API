const shuffleArray = (array) => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const assignSecretSantas = (members) => {
  if (members.length === 0) {
    return [];
  }

  const shuffledMembers = shuffleArray(members);

  const secretSantaAssignments = [];

  for (let i = 0; i < shuffledMembers.length; i++) {
    const giver = shuffledMembers[i];
    const receiver =
      i === shuffledMembers.length - 1
        ? shuffledMembers[0]
        : shuffledMembers[i + 1];
    secretSantaAssignments.push({ giver, receiver });
  }

  return secretSantaAssignments;
};

module.exports = { assignSecretSantas };
