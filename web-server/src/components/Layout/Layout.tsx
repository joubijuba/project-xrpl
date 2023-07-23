import Navigation from "./Navigation"
import classes from "./Layout.module.css"
import React from "react"

function Layout(props: any) {
    return (
        <React.Fragment>
            <Navigation></Navigation>
            <main className = {classes.main}> {props.children} </main>
        </React.Fragment>
    )
}

export default Layout