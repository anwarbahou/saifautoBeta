import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          color: '#0F172A',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 85.06 87.51" xmlns="http://www.w3.org/2000/svg" style={{color: 'currentColor'}}>
          <g>
            <path style={{fill: 'currentColor'}} d="M38.3,32.91h-10.47V14.96c-8.39,5.48-15.33,14.46-16.45,24.68h26.92v47.87C22.21,82.87,6.78,71.09,1.66,54.6h11.22c1.86,5.32,5.92,11.23,10.12,14.94,1.18,1.04,3.26,2.77,4.84,3.01v-24.68H.16C-1.97,24.06,17.58,6.96,38.3,0v32.91Z"/>
            <path style={{fill: 'currentColor'}} d="M45.96.35v86.77c1.75.54,11.22-3.2,11.22-4.11v-34.78h16.45c-.37,6.99-4.67,12.63-8.21,18.27,1.72,1.06,6.11,5.24,7.68,4.84,2.5-.64,8.04-10.72,9.11-13.4C93.08,30.85,71.02,6.8,45.96.35ZM57.18,39.99V15.31c1.78.58,4.73,2.82,6.01,4.08,5.07,5.01,10.32,13.31,10.44,20.6h-16.45Z"/>
          </g>
        </svg>
        <style>{`
          @media (prefers-color-scheme: dark) {
            div {
              color: white;
            }
          }
        `}</style>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
} 