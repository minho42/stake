export const About = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center bg-gradient-to-r from-green-700 to-green-400 py-8 text-center">
        <div className="flex flex-col justify-center max-w-lg w-full text-2xl font-semibold leading-snug text-white">
          Stake
          <div className="text-green-100 block">How to login</div>
        </div>
      </div>
      <div className="flex justify-center">
        <ul>
          <li>How to login</li>
          <li></li>
        </ul>
      </div>

      <div className="flex justify-center text-center text-gray-500">
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
