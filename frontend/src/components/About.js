export const About = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center py-6 text-center">
        <div className="flex flex-col justify-center max-w-lg w-full text-2xl">Stake</div>
      </div>
      <div className="flex justify-center">
        <ul>
          <li>How to login</li>
          <li></li>
        </ul>
      </div>

      <div className="flex justify-center text-center">
        Made by
        <a
          className="underline block ml-1"
          href="https://twitter.com/minhokim42"
          target="_blank"
          rel="noopener noreferrer"
        >
          minhokim42
        </a>
      </div>
    </div>
  );
};
