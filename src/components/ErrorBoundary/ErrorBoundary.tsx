import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className='flex h-screen w-full flex-col items-center justify-center'>
          <h1 className='text-9xl font-extrabold tracking-widest text-gray-900'>500</h1>
          <div className='bg-orange absolute rotate-12 rounded px-2 text-sm text-white'>Error!</div>
          <button className='mt-5'>
            <a
              href='/'
              className='group relative inline-block text-sm font-medium text-white focus:outline-none focus:ring active:text-orange-500'
            >
              <span className='bg-orange absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-x-0 group-hover:translate-y-0' />
              <span className='relative block border border-current px-8 py-3'>
                <span>Go Home</span>
              </span>
            </a>
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
