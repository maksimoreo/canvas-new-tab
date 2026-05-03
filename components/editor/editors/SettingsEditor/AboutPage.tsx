export default function AboutPage() {
  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <h1 className="text-center font-bold text-xl mt-4">CanvasNewTab</h1>

      <p className="text-justify">
        CanvasNewTab replaces your browser's default home tab with a clean,
        customizable space that's entirely your own. Its intuitive editor gives
        you full control: place bookmarks anywhere, group them together, apply a
        favorite color theme, or style each bookmark individually. You can jump
        into edit mode right from the home tab and make quick updates using
        handy multi-item tools. With CanvasNewTab, your new home tab becomes a
        blend of productivity and personal style.
      </p>

      <p>
        GitHub page:{' '}
        <a href="https://github.com/maksimoreo/canvas-tab">
          https://github.com/maksimoreo/canvas-tab
        </a>
      </p>
    </div>
  )
}
