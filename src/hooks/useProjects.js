import * as React from 'react'

import { AppContext } from '../context/AppProvider'

export default function useProjects(template) {
    const {
        data: { projects },
    } = React.useContext(AppContext)

    if (!projects) {
        return null
    } else {
        return projects.projects.filter(
            i =>
                i['render-status'] !== 'canceled' &&
                i.template.template === template,
        )
    }
}
