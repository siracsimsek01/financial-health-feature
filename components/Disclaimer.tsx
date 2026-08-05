export function Disclaimer() {
  return (
    <div className="border-t border-zinc-200 pt-6 text-sm leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <p>
        This overview is based on the income and spending information recorded
        for you, and is here to help you understand your position. It is not
        financial advice.
      </p>
      <p className="mt-2">
        If money is feeling difficult right now, free and independent support
        is available from{" "}
        <a
          className="font-medium text-zinc-700 underline underline-offset-2 dark:text-zinc-300"
          href="https://www.moneyhelper.org.uk"
          target="_blank"
          rel="noopener noreferrer"
        >
          MoneyHelper
        </a>{" "}
        and{" "}
        <a
          className="font-medium text-zinc-700 underline underline-offset-2 dark:text-zinc-300"
          href="https://www.stepchange.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          StepChange
        </a>
        .
      </p>
    </div>
  );
}
