import { disclaimerIntro } from "@/financial-health/copy";

export function Disclaimer() {
  return (
    <div className="border-t border-zinc-200 pt-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
      <p>
        {disclaimerIntro} If money is feeling difficult right now, free and
        independent support is available from{" "}
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
