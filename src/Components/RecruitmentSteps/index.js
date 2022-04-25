import * as React from 'react'
import Level2 from './level2'
import Level1 from './level1'
import Level3 from './level3'

function RecruitmentPage() {
    const [index, setIndex] = React.useState(1)
    React.useEffect(() => {}, [])
    return (
        <div>
            {index === 1 && <Level1 setIndex={setIndex} />}
            {index === 2 && <Level2 setIndex={setIndex} />}
            {index === 3 && <Level3 setIndex={setIndex} />}
        </div>
    )
}

export default RecruitmentPage
