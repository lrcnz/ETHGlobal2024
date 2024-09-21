import TokenImage from "./token-image";

export const Token = ({ token }: { token: string }) => {
  return (
    <div className="flex items-center gap-1 text-sm leading-4 font-bold">
      <TokenImage token={token} />
      <div>{token}</div>
    </div>
  );
}

Token.displayName = 'Token';