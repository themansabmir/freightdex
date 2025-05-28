export function generateDummyTeamData(count: number = 10) {
  const roles = ['Admin', 'Manager', 'Developer', 'Designer'];

  const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const getRandomBool = () => Math.random() < 0.5;
  const getRandomName = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank'];
    return getRandomItem(names);
  };

  const data = [];

  for (let i = 0; i < count; i++) {
    const firstName = getRandomName();
    const lastName = getRandomName();
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const email = `${username}@example.com`;

    data.push({
      _id: `${i + 1}`,
      email,
      role: getRandomItem(roles),
      first_name: firstName,
      last_name: lastName,
      username,
      is_active: getRandomBool(),
    });
  }

  return data;
}
