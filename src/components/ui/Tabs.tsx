import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

import { createContext, useContext } from 'react'

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider')
  }
  return context
}

export function Tabs({ defaultValue = '', value, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const activeTab = value ?? internalValue
  
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value
  
  const handleClick = () => {
    setActiveTab(value)
  }
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setActiveTab(value)
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      // Handle arrow key navigation
      const tabList = event.currentTarget.parentElement
      if (tabList) {
        const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'))
        const currentIndex = tabs.indexOf(event.currentTarget)
        let nextIndex
        
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % tabs.length
        } else {
          nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1
        }
        
        const nextTab = tabs[nextIndex] as HTMLElement
        nextTab.focus()
        const nextValue = nextTab.getAttribute('data-value')
        if (nextValue) {
          setActiveTab(nextValue)
        }
      }
    }
  }
  
  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-value={value}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext()
  
  if (activeTab !== value) {
    return null
  }
  
  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', className)}
    >
      {children}
    </div>
  )
} 