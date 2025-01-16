import { PriceProvider } from '@/src/context/price.context';
import { StakingProvider } from '@/src/context/staking.context';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PriceProvider>
      <StakingProvider>{children}</StakingProvider>
    </PriceProvider>
  );
};

export default Layout;
