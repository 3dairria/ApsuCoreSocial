import { Plus } from 'lucide-react'
import { STORIES } from '../../lib/data'

export default function StoryRow() {
  return (
    <div className="flex gap-3 px-4 py-3 overflow-x-auto hide-scrollbar">
      {STORIES.map(story => (
        <button key={story.id} className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="relative">
            {story.hasNew && (
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  padding: 2,
                  background: 'linear-gradient(135deg, #7C3AED, #D4A843)',
                  borderRadius: '50%',
                }}
              />
            )}
            <div
              className="relative w-14 h-14 rounded-full flex items-center justify-center z-10"
              style={{
                background: story.avatarColor,
                outline: story.hasNew ? '2px solid #0c0c0e' : 'none',
                outlineOffset: 2,
              }}
            >
              {story.isAdd ? (
                <Plus size={20} className="text-purple-lt" strokeWidth={2.5} />
              ) : (
                <span className="text-white font-semibold text-base">{story.name[0]}</span>
              )}
            </div>
          </div>
          <span className="text-[10px] text-muted w-14 text-center truncate">{story.name}</span>
        </button>
      ))}
    </div>
  )
}
