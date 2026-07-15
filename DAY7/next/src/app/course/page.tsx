export default async function Course() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return <div>next.js 1교시</div>;
}
