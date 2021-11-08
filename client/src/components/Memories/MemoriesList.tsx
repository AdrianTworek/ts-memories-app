import { FC, useRef, useEffect, MutableRefObject, Fragment } from 'react'
import { v4 as uuid } from 'uuid'
import { useSelector } from 'react-redux'
import { FormModeState, MemoryState } from '../../type'

import Memory from './Memory/Memory'

interface Props {
  limit: number
  page: number
}

const MemoriesList: FC<Props> = ({ limit, page }) => {
  const memories = useSelector((state: MemoryState) => state.memories)
  const isEdit = useSelector((state: FormModeState) => state.isEdit)
  const memoryRef = useRef() as MutableRefObject<HTMLDivElement>

  useEffect(() => {
    // Scroll to the first memory on mobile devices
    setTimeout(() => {
      if (
        memories.length > 0 &&
        window.innerWidth < 960 &&
        !isEdit &&
        document.body.getBoundingClientRect().top === 0
      ) {
        const distanceFromTop = memoryRef.current?.getBoundingClientRect().top
        window.scrollTo({ top: distanceFromTop - 30, behavior: 'smooth' })
      }
    }, 700)
  }, [])

  return (
    <>
      {memories.map((memory, idx) => {
        return limit === 10 ? (
          <Memory
            key={uuid()}
            _id={memory._id}
            author={memory.author}
            ref={idx === 0 ? memoryRef : undefined}
            createdAt={memory.createdAt}
            date={memory.date}
            title={memory.title}
            description={memory.description}
            image={memory.image}
          />
        ) : (
          <Fragment key={uuid()}>
            {idx < limit && (
              <Memory
                _id={memory._id}
                author={memory.author}
                ref={idx === 0 ? memoryRef : undefined}
                createdAt={memory.createdAt}
                date={memory.date}
                title={memory.title}
                description={memory.description}
                image={memory.image}
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}

export default MemoriesList
