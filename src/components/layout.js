import React from "react"
import { Link } from "gatsby"

import { rhythm } from "../utils/typography"

const Layout = ({ title, children }) => {
  const header = (
    <h3
      style={{
        fontFamily: `Montserrat, sans-serif`,
        marginTop: 0,
      }}
    >
      <Link
        style={{
          boxShadow: `none`,
          color: `inherit`,
        }}
        to={`/`}
      >
        {title}
      </Link>
    </h3>
  )

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(24),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        <a href="https://github.com/pirey" target="_blank" rel="noopener">Github</a>{' '}
        <a href="https://github.com/pratama.yeri" target="_blank" rel="noopener">Facebook</a>{' '}
        <a href="https://github.com/_pirey" target="_blank" rel="noopener">Twitter</a>{' '}
      </footer>
    </div>
  )
}

export default Layout
