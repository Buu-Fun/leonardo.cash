import { ethers } from 'ethers';
import { Asset, AssetConfig, Crowdfunding } from '../gql/types/graphql';
import AssetStatus from '../types/AssetStatus';
import {
  decodeAssetData,
  getAssetCityAndCountry,
  getAssetStatus,
  getISOCode,
} from '../utils/asset';
import { getChain } from '../chains';

export const calculateAssetValues = ({
  asset,
  assetConfig,
  assetCrowdfunding,
}: {
  asset?: Asset;
  assetConfig?: AssetConfig;
  assetCrowdfunding?: Crowdfunding;
}) => {
  const [_id, category, iata] = asset
    ? decodeAssetData(asset.data || '0x')
    : assetConfig
      ? [assetConfig._id, assetConfig.category, assetConfig.iata]
      : ['', '', ''];
  const chain = getChain(asset?.chainId || assetConfig?.chainId || 1);
  const location = iata
    ? getAssetCityAndCountry(iata)
    : 'Andorra, United Arab Emirates';
  const iso = getISOCode(iata);
  const status = asset
    ? getAssetStatus(asset, assetCrowdfunding)
    : AssetStatus.Draft;
  const assetPrice = asset
    ? Number.parseFloat(ethers.formatUnits(asset.price, asset.priceDecimals))
    : 0;
  const currency = asset
    ? asset.oracle.currency
    : assetConfig?.currency || 'usd';
  const raised =
    asset && assetCrowdfunding
      ? Number.parseFloat(
          ethers.formatUnits(
            BigInt(asset.supply) -
              BigInt(assetCrowdfunding.onSaleBalance.balance),
            asset.decimals,
          ),
        ) * assetPrice
      : 0;
  const goal = asset
    ? Number.parseFloat(ethers.formatUnits(asset.cap, asset.decimals)) *
      assetPrice
    : 0;

  return {
    _id,
    chain,
    iata,
    iso,
    location,
    status,
    assetPrice,
    currency,
    raised,
    goal,
    category,
  };
};
