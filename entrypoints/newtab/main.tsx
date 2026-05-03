import React from 'react'
import ReactDOM from 'react-dom/client'
import FontPicker from 'react-fontpicker-ts-lite'

import '@/assets/tailwind.css'
import './style.css'

import App from './App'
import { loadInitialData } from '@/components/editor/serialization/initialData'
import { groupIdGenerator, linkIdGenerator } from '@/lib/share'

import DocumentContextProvider from '@/components/DocumentContextProvider'
import GridContextProvider from '@/components/GridContextProvider'
import ItemsContextProvider from '@/components/ItemsContextProvider'
import { ThemeProvider } from '@/components/Theme/ThemeProvider'

const initialData = await loadInitialData()

linkIdGenerator.current = initialData.deserialized.linkIndex
groupIdGenerator.current = initialData.deserialized.groupIndex

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FontPicker loaderOnly loadFonts={[initialData.document.fontFamily]} />

    <ThemeProvider>
      <GridContextProvider
        initialState={{
          cellSize: initialData.document.gridCellSize,
          gridVisible: initialData.document.gridVisible,
        }}
      >
        <DocumentContextProvider
          initialBackground={initialData.document.background}
          initialFontFamily={initialData.document.fontFamily}
          initialShowEditorModeButton={
            initialData.document.showEditorModeButton
          }
        >
          <ItemsContextProvider initialItems={initialData.deserialized.items}>
            <App />
          </ItemsContextProvider>
        </DocumentContextProvider>
      </GridContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)
