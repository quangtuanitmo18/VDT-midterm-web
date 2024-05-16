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
            <main className='flex flex-col items-center justify-center w-full h-screen'>
          <h1 className='font-extrabold tracking-widest text-gray-900 text-9xl'>500</h1>
          <div className='absolute px-2 text-sm text-white rounded rotate-12 bg-orange'>Error!</div>
          <button className='mt-5'>
            <a
              href='/'
              className='relative inline-block text-sm font-medium text-white active:text-orange-500 group focus:outline-none focus:ring'
            >
              <span className='absolute inset-0 translate-x-0.5 translate-y-0.5 bg-orange transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
              <span className='relative block px-8 py-3 border border-current'>
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
