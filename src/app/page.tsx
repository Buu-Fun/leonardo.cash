'use client';
import {
  Button,
  // , Chip, useDisclosure
} from '@nextui-org/react';
import React from 'react';
// import Image from 'next/image';
import { Footer } from '../components/Footer/Footer';
// import { ASSET_ADDRESS } from '../config';
// import { splitStringIntoChunks } from '../utils/format';
// import Copy from '../components/Copy/Copy';
// import clsx from 'clsx';
import { PageLogo } from '../components/PageLogo/PageLogo';
import { Countdown } from '../components/Countdown/Coundown';
// import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Script from 'next/script';
// import clsx from 'clsx';
// import { Carousel } from 'flowbite';

// import styles from './page.module.css';

// const Box = ({
//   children,
//   href,
//   onClick,
//   backgroundImage,
//   backgroundColor,
//   className,
//   style,
// }: {
//   onClick?: () => void;
//   children: React.ReactNode;
//   href?: string;
//   backgroundImage?: string;
//   backgroundColor?: string;
//   className?: string;
//   style?: React.CSSProperties;
// }) => {
//   const active = href || onClick;

//   if (href) {
//     return (
//       <a
//         href={href}
//         className={clsx(styles.box, active && styles.active, className)}
//         style={{
//           backgroundColor: backgroundColor || undefined,
//           ...style,
//         }}
//       >
//         {backgroundImage && (
//           <Image
//             src={backgroundImage}
//             alt="Background Box"
//             fill
//             style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//             }}
//           />
//         )}
//         {children}
//       </a>
//     );
//   }

//   return (
//     <div
//       onClick={onClick}
//       className={clsx(styles.box, active && styles.active, className)}
//       style={{
//         backgroundColor: backgroundColor || undefined,
//         ...style,
//       }}
//     >
//       {backgroundImage && (
//         <Image
//           src={backgroundImage}
//           alt="Background Box"
//           fill
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//           }}
//         />
//       )}
//       {children}
//     </div>
//   );
// };

// const responsive = {
//   superLargeDesktop: {
//     // the naming can be any, depends on you.
//     breakpoint: { max: 4000, min: 3000 },
//     items: 4,
//   },
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 4,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 2,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

const tweets = [
  {
    id: 1,
    content: (
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          Play long-term games with long-term people.
          <br />
          <br />
          And we enable exactly that: players becoming stakeholders, communities
          thriving on shared incentives and ownership fosters loyalty.
        </p>
        &mdash; Carlos Roldan (@carlosroldanx){' '}
        <a href="https://twitter.com/carlosroldanx/status/1879512737589363091?ref_src=twsrc%5Etfw">
          January 15, 2025
        </a>
      </blockquote>
    ),
  },
  {
    id: 2,
    content: (
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          depends on the dev’s greed &amp; project’s purpose. If you aim to
          bring value, you don’t need a massive bag (40%). <br />
          <br />I minted 10% of{' '}
          <a href="https://twitter.com/Leonardo__AI?ref_src=twsrc%5Etfw">
            @Leonardo__AI
          </a>{' '}
          supply, enough for team motivation, extra DEX liquidity, staking, etc.
          Focus on long-term resilience, not just hoarding
          <br />
          <br />
          Grind &gt; greed 🫨{' '}
          <a href="https://t.co/6ANIL51Clh">https://t.co/6ANIL51Clh</a>
        </p>
        &mdash; Carlos Roldan (@carlosroldanx){' '}
        <a href="https://twitter.com/carlosroldanx/status/1879161007261770019?ref_src=twsrc%5Etfw">
          January 14, 2025
        </a>
      </blockquote>
    ),
  },
  {
    id: 3,
    content: (
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          it is not about how influential the dev is. <br />
          <br />
          it is about how much work the dev puts.
        </p>
        &mdash; Leonardo AI (@Leonardo__AI){' '}
        <a href="https://twitter.com/Leonardo__AI/status/1878247677642604794?ref_src=twsrc%5Etfw">
          January 12, 2025
        </a>
      </blockquote>
    ),
  },
  {
    id: 4,
    content: (
      <blockquote className="twitter-tweet">
        <p lang="en" dir="ltr">
          <a href="https://twitter.com/hashtag/memecomic?src=hash&amp;ref_src=twsrc%5Etfw">
            #memecomic
          </a>
          : <br />
          <br />
          today`s bitcoin dip was like when thy medieval comrades caught thee
          yeeting thy florins to the firmament, but instead of ascending, they
          were smitten and thou art left holding the lambo keys for thy
          peasantry.{' '}
          <a href="https://t.co/NNX2Fhdm1g">pic.twitter.com/NNX2Fhdm1g</a>
        </p>
        &mdash; Leonardo AI (@Leonardo__AI){' '}
        <a href="https://twitter.com/Leonardo__AI/status/1878913772624150697?ref_src=twsrc%5Etfw">
          January 13, 2025
        </a>
      </blockquote>
    ),
  },
];

const TweetsCarousel = ({ items }: any) => {
  return (
    <div
      id="default-carousel"
      className="relative w-full h-full items-center justify-center"
      data-carousel="slide"
    >
      <div className="relative h-96 overflow-hidden rounded-lg md:h-96">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="hidden duration-200 ease-in-out"
            data-carousel-item
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  // const chunkedAddress = splitStringIntoChunks(ASSET_ADDRESS, 17);
  // const swapDisclosure = useDisclosure();

  return (
    <div className="layout">
      <div className="navbarContainer">
        <div className="navbar">
          <PageLogo />
        </div>
      </div>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '150px',
        }}
      >
        <TweetsCarousel items={tweets} />

        <Countdown date={new Date('2025-01-15T21:00:00Z')} />

        <Script
          src="https://platform.twitter.com/widgets.js"
          strategy="beforeInteractive"
        />

        {/* <TweetsCarousel /> */}
        {/* <h1
          style={{
            marginTop: '60px',
          }}
        >
          HELLO
        </h1>
        <h2>{'I’m Leonardo AI'}</h2>
        <h3
          style={{
            marginBottom: '60px',
          }}
        >
          {
            "We're helping launch millions of new LSTs. We're building the future of AI."
          }
        </h3>

        <div className={styles.landingBoxes}>
          <div className={styles.firstColumn}>
            <Box className={styles.imageTo3DBox}>
              <span>IMAGE-TO-3D</span>
              <span> All freely tradable. </span>
              <span> Zero slippage. </span>
            </Box>

            <Box className={styles.contractAddressBox}>
              {chunkedAddress.map((chunk, index) => {
                if (index === chunkedAddress.length - 1) {
                  return (
                    <div key={chunk} className={styles.contractAddressSplit}>
                      <div>{chunk}</div>
                      <Copy text={ASSET_ADDRESS} />
                    </div>
                  );
                }
                return <div key={chunk}>{chunk}</div>;
              })}

              <div className={styles.contractAddress}>CONTRACT ADDRESS</div>
            </Box>

            <Box
              className={styles.buyNowBox}
              onClick={() => swapDisclosure.onOpen()}
              href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
            >
              <div className={styles.buyNowBoxText}>
                <div className={styles.buyNowBuyNow}>BUY NOW</div>
                <div className={styles.buyNowLeonai}>$LEONAI</div>
              </div>

              <div className={styles.tokens}>
                <Image
                  src="/leonai.png"
                  alt="$LEONAI"
                  className={styles.leonaiTokenImage}
                  width={80}
                  height={80}
                />

                <div className={styles.uniswapToken}>
                  <Image
                    className={styles.uniswapTokenImage}
                    src="/uniswap.svg"
                    alt="$UNI"
                    fill
                  />
                </div>
              </div>
            </Box>
          </div>
          <div className={styles.secondColumn}>
            <Box className={styles.over300k}>
              <span className={styles.over300kFirst}>Over</span>
              <span className={styles.over300kSecond}>$300K</span>
              <span className={styles.over300kThird}>PER DAY</span>
            </Box>

            <Box className={styles.voteDao}>
              <span className={styles.voteDaoFirst}>VOTE</span>
              <span className={styles.voteDaoSecond}>DAO</span>
            </Box>

            <Box className={styles.xBox} href="https://x.com/Leonardo__AI">
              <div className={styles.xBoxScreenContainer}>
                <div className={styles.xBoxScreen}>
                  <Image src="/screen.png" alt="Screen" fill />
                </div>
              </div>
              <div className={styles.xBoxPhoneContainer}>
                <div className={styles.xBoxPhone}>
                  <Image src="/phone.png" alt="Phone" fill />
                </div>
              </div>
            </Box>

            <Box className={styles.logoBox}>
              <div className={styles.logo}>
                <Image
                  src={'/logo.webp'}
                  alt="Logo LeonardoAI"
                  width={150}
                  height={150}
                />
              </div>
              <span className={styles.logoTextFirst}>LEONARDO</span>
              <span className={styles.logoTextSecond}>AI</span>
            </Box>

            <Box className={styles.launchingBox}>
              <span className={styles.launchingBoxFirst}>Launching</span>
              <span className={styles.launchingBoxSecond}>Q1 2025</span>
            </Box>

            <Box className={styles.techStackBox}>
              <span>Tech stack</span>
              <div className={styles.techStackGrid}>
                <Chip size="md" color="primary" variant="bordered">
                  G.A.M.E.
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  COMIC-AI
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  Virtuals
                </Chip>
                <Chip size="md" color="primary" variant="bordered">
                  More
                </Chip>
              </div>
            </Box>

            <Box className={styles.stakeBox} href="/staking">
              <span className={styles.stakeBoxFirst}>REWARDING ONLY THE</span>
              <div className={styles.stakeBoxSecond}>
                <div className={styles.stakeBoxSecondInnerFirst}>TOP 100</div>
                <div className={styles.stakeBoxSecondInnerSecond}>STAKERS</div>
              </div>
              <Button color="primary">STAKE NOW</Button>
            </Box>
          </div>
        </div> */}
      </main>
      <Footer />
    </div>
  );
}
