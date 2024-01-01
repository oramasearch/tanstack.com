import type { MetaFunction } from '@remix-run/node'
import { seo } from '~/utils/seo'
import { Outlet } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return seo({
    title:
      'TanStack Form Docs | React Form, Solid Form, Svelte Form, Vue Form',
  })
}

export default function RouteFrameworkParam() {
  return (
    <>
      <Outlet />
      {/* <Docs
        {...{
          logo: createLogo(config.versionConfig.selected),
          colorFrom: 'from-rose-500',
          colorTo: 'to-violet-500',
          textColor: 'text-violet-500',
          config: config!,
          framework: config.frameworkConfig,
          version: config.versionConfig,
        }}
      /> */}
    </>
  )
}