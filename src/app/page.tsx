import Image from 'next/image'
import heroImage from '@/assets/hero.png'
import reactLogo from '@/assets/react.svg'
import { Counter } from './counter'

export default function Home() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <Image
            src={heroImage}
            className="base"
            width={170}
            height={179}
            priority
            alt=""
          />
          <Image
            src={reactLogo}
            className="framework"
            width={36}
            height={32}
            alt="React logo"
          />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/app/page.tsx</code> and save to see your changes
          </p>
        </div>
        <Counter />
      </section>

      <div className="ticks" />

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon" />
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
                Explore Next.js
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <Image
                  className="button-icon"
                  src={reactLogo}
                  width={18}
                  height={18}
                  alt=""
                />
                Learn React
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon" />
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Next.js community</p>
          <ul>
            <li>
              <a
                href="https://github.com/vercel/next.js"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon" />
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://nextjs.org/discord" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon" />
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/nextjs" target="_blank" rel="noreferrer">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon" />
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a
                href="https://bsky.app/profile/nextjs.org"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon" />
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks" />
      <section id="spacer" aria-hidden="true" />
    </>
  )
}
