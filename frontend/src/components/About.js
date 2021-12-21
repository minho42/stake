export const About = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center py-3 text-center">
        <div className="flex flex-col justify-center max-w-md w-full text-2xl">Stake</div>
      </div>
      <div className="flex justify-center text-center">
        <a
          className="underline"
          href="https://github.com/minho42/stake"
          target="_blank"
          rel="noopener noreferrer"
        >
          github
        </a>
      </div>

      <div className="flex justify-center text-center">
        <a
          className="underline"
          href="https://twitter.com/minhokim42"
          target="_blank"
          rel="noopener noreferrer"
        >
          twitter
        </a>
      </div>
    </div>
  );
};
