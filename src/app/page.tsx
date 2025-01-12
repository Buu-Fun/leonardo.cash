'use client';
import { Button, Chip } from '@nextui-org/react';
import React from 'react';
import Image from 'next/image';
import { Footer } from '../components/Footer/Footer';
import { ASSET_ADDRESS } from '../config';
import { splitStringIntoChunks } from '../utils/format';
import Copy from '../components/Copy/Copy';
import clsx from 'clsx';

const Box = ({
  children,
  backgroundImage,
  backgroundColor = '#222222',
  className,
  style,
}: {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={clsx('box', className)}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      backgroundColor,
      // borderRadius: '32px',
      overflow: 'hidden',
      ...style,
    }}
  >
    {backgroundImage && (
      <Image
        src={backgroundImage}
        alt="Background Box"
        fill
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    )}
    {children}
  </div>
);

export default function Page() {
  const chunkedAddress = splitStringIntoChunks(ASSET_ADDRESS, 17);
  return (
    <div className="layout">
      <header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={'/logo.webp'}
            alt="Logo LeonardoAI"
            width={80}
            height={80}
          />
          <span
            style={{
              color: '#FFFFFF',
              fontFamily: 'Bebas Neue',
              fontSize: '41.329px',
              fontStyle: 'italic',
              fontWeight: '700',
              lineHeight: '42.939px',
              letterSpacing: '-0.072px',
              textTransform: 'uppercase',
            }}
          >
            LEONARDO
          </span>
          <span
            style={{
              color: '#803BF1',
              fontFamily: 'Bebas Neue',
              fontSize: '41.329px',
              fontStyle: 'italic',
              fontWeight: '700',
              lineHeight: '42.939px',
              letterSpacing: '-0.072px',
              textTransform: 'uppercase',
            }}
          >
            AI
          </span>
        </div>

        <a href="/staking">
          <Button color="primary">Launch App</Button>
        </a>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <h1
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

        <div className="landing-boxes">
          <div className="first-column">
            <Box backgroundColor="#803BF1">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '28px',
                  gap: '30px',
                  padding: '80px 20px',
                  fontWeight: 600,
                }}
              >
                <span>IMAGE-TO-3D</span>
                <span> All freely tradable. </span>
                <span> Zero slippage. </span>
              </div>
            </Box>

            <Box>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '24px',
                  padding: '30px 40px',
                  fontWeight: 600,
                  textAlign: 'start',
                }}
              >
                {chunkedAddress.map((chunk, index) => {
                  if (index === chunkedAddress.length - 1) {
                    return (
                      <div key={chunk} style={{ display: 'flex', gap: '4px' }}>
                        <div>{chunk}</div>
                        <Copy text={ASSET_ADDRESS} />
                      </div>
                    );
                  }
                  return <div key={chunk}>{chunk}</div>;
                })}

                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    fontSize: '13px',
                    position: 'absolute',
                    backgroundColor: '#803BF1',
                    color: '#FFFFFF',
                    padding: '10px',
                    width: '300px',
                    bottom: '0',
                    right: '0',
                    whiteSpace: 'nowrap',
                    transform: 'translate(80px, -25px) rotate(-32deg)',
                    textAlign: 'center',
                    justifyContent: 'center',
                  }}
                >
                  CONTRACT ADDRESS
                </div>
              </div>
            </Box>

            <Box
              style={{
                flexDirection: 'row',
                padding: '28.5px 20px',
                gap: '0',
                background:
                  'linear-gradient(220deg,rgb(129, 59, 241, 0.6) 0%, #222222 80%)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '30px',
                  fontWeight: 600,
                  justifyContent: 'flex-start',
                  textAlign: 'start',
                }}
              >
                <div
                  style={{
                    color: '#803BF1',
                    fontWeight: 800,
                    lineHeight: '48px',
                  }}
                >
                  BUY NOW
                </div>
                <div
                  style={{
                    fontSize: '42px',
                    lineHeight: '42px',
                  }}
                >
                  $LEONAI
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  textAlign: 'start',
                  marginLeft: '-10px',
                }}
              >
                <Image
                  src="/leonai.png"
                  alt="$LEONAI"
                  width={80}
                  height={80}
                  style={{
                    transform: 'rotate(-15deg)',
                    marginBottom: '60px',
                    marginRight: '-10px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    zIndex: 1,
                    minWidth: '80px',
                    minHeight: '80px',
                  }}
                />

                <div
                  style={{
                    marginTop: '60px',
                    marginLeft: '-15px',
                    transform: 'rotate(15deg)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    width: '80px',
                    height: '80px',
                    minWidth: '80px',
                    minHeight: '80px',
                  }}
                >
                  <Image
                    src="/uniswap.svg"
                    alt="$UNI"
                    fill
                    style={{
                      scale: 1.4,
                      transform: 'rotate(-25deg)',
                    }}
                  />
                </div>
              </div>
            </Box>
          </div>
          <div className="second-column">
            <Box
              style={{
                fontWeight: 700,
                padding: '40px 20px',
                gap: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '53px',
                  lineHeight: '53px',
                }}
              >
                Over
              </span>
              <span
                style={{
                  fontSize: '72px',
                  lineHeight: '72px',
                }}
              >
                $300K
              </span>
              <span
                style={{
                  fontSize: '30px',
                  lineHeight: '30px',
                }}
              >
                PER DAY
              </span>
            </Box>

            <Box
              style={{
                fontWeight: 700,
                padding: '40px 20px',
                gap: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  lineHeight: '32px',
                }}
              >
                VOTE
              </span>
              <span
                style={{
                  fontSize: '92px',
                  lineHeight: '92px',
                }}
              >
                DAO
              </span>
            </Box>

            <Box
              style={{
                minWidth: 380,
                height: 280,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 280,
                  height: 600,
                  top: 30,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 280,
                    height: 600,
                    borderRadius: '50px',
                    overflow: 'hidden',
                  }}
                >
                  <Image src="/screen.png" alt="Screen" fill />
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  width: 300,
                  height: 600,
                  top: 30,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: 300,
                    height: 600,
                  }}
                >
                  <Image src="/phone.png" alt="Phone" fill />
                </div>
              </div>
            </Box>

            <Box
              style={{
                gridColumn: 'span 2',
              }}
            >
              <div className="logo">
                <Image
                  src={'/logo.webp'}
                  alt="Logo LeonardoAI"
                  width={180}
                  height={180}
                />
                <span
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Bebas Neue',
                    fontSize: '84px',
                    fontStyle: 'italic',
                    fontWeight: '700',
                    lineHeight: '84px',
                    letterSpacing: '-0.072px',
                    textTransform: 'uppercase',
                    marginLeft: '-20px',
                  }}
                >
                  LEONARDO
                </span>
                <span
                  style={{
                    color: '#803BF1',
                    fontFamily: 'Bebas Neue',
                    fontSize: '84px',
                    fontStyle: 'italic',
                    fontWeight: '700',
                    lineHeight: '84px',
                    letterSpacing: '-0.072px',
                    textTransform: 'uppercase',
                  }}
                >
                  AI
                </span>
              </div>
            </Box>

            <Box backgroundColor="#803BF1" style={{ padding: '40px 0px' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                Launching
              </span>
              <span
                style={{
                  fontSize: '60px',
                  fontWeight: 600,
                }}
              >
                Q1 2025
              </span>
            </Box>

            <Box
              style={{
                padding: '20px',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                }}
              >
                Tech stack
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  padding: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  placeItems: 'center',
                }}
              >
                <Chip size="lg" color="primary" variant="bordered">
                  G.A.M.E.
                </Chip>
                <Chip size="lg" color="primary" variant="bordered">
                  COMIC-AI
                </Chip>
                <Chip size="lg" color="primary" variant="bordered">
                  Virtuals
                </Chip>
                <Chip size="lg" color="primary" variant="bordered">
                  More
                </Chip>
              </div>
            </Box>

            <Box
              style={{
                gridColumn: 'span 2',
                padding: '40px 20px',
                gap: '4px',
              }}
            >
              <span
                style={{
                  fontSize: '30px',
                  lineHeight: '30px',
                  fontWeight: 600,
                }}
              >
                REWARDING ONLY THE
              </span>
              <div
                className={clsx('responsive')}
                style={{
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '57px',
                    lineHeight: '57px',
                    fontWeight: 600,
                    color: '#803BF1',
                  }}
                >
                  TOP 100
                </span>
                <span
                  style={{
                    fontSize: '57px',
                    lineHeight: '57px',
                    fontWeight: 600,
                  }}
                >
                  STAKERS
                </span>
              </div>
              <a href="/staking">
                <Button color="primary">STAKE NOW</Button>
              </a>
            </Box>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
