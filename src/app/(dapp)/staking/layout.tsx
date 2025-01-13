import { StakingProvider } from '@/src/context/staking.context';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <StakingProvider>{children}</StakingProvider>;
};

export default Layout;
