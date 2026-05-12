import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

const Button = ({ children, href, className }: ButtonProps) => {
  return (
    <div className="mt-16 text-center">
      <Link
        href={href}
        className={`bg-secondary border-secondary hover:text-secondary inline-block rounded-full border-2 px-10 py-3 text-sm font-bold tracking-wider text-white uppercase transition-all duration-300 ease-in-out hover:bg-transparent ${className}`}
      >
        {children}
      </Link>
    </div>
  );
};

export default Button;
