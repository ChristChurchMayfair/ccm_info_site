import React, { Component } from "react"
import "./Service.css"
import '../shared.css'
import { daysOfTheWeek, dateEndings, monthNames } from "./dateHelpers"
import { Service } from "./Types"



export function ServiceFromContentfulItem(item: any): Service {
    var service: Service = {
        id: item.sys.id,
        title: item.fields.title,
        series: item.fields.series ? item.fields.series.fields : undefined,
        time: item.fields.time,
        date: item.fields.date,
        biblePassages: item.fields.biblePassages,
        note: item.fields.note,
    }
    return service
}

type Props = {
    service: Service
    seriesClass?: string;
    showSeries: boolean
    serviceData?: {display: string, className: string}
    showDate: boolean
}

type State = {}

export class ServiceView extends Component<Props,State> {

    constructor(props: Props) {
        super(props)
        this.state = {services: []}
    }

    render() {

        let series
        if (this.props.showSeries && this.props.service.series) {
            series = <div className={["series",this.props.seriesClass].join(" ")}>{this.props.service.series.title}</div>
        }

        let passages
        if (this.props.service.biblePassages) {
        passages = this.props.service.biblePassages.map(biblePassage => {
            return <div key={biblePassage} className="biblepassage">{biblePassage}</div>
        })
        } else {
            passages = <div className="biblepassage"><br/></div>
        }

        let timeOrName
        if (this.props.serviceData) {
            timeOrName = <div className={["name",this.props.serviceData.className].join(" ")}>{this.props.service.time}</div>
        } else {
            timeOrName = <div className="time">{this.props.service.time}</div>
        }

        let dateString
        if (this.props.showDate) {
            let date = new Date(this.props.service.date)
            dateString = <div className="date">{daysOfTheWeek[date.getDay()]} {date.getDate()}{dateEndings[date.getDate()]} {monthNames[date.getMonth()]}</div>
        } else {
            dateString = <span></span>
        }

        let note
        if (this.props.service.note) {
            note = <div className="note">{this.props.service.note}</div>
        } else {
            note = ""
        }

        return <div className={["service",this.props.serviceData ? this.props.serviceData.className : undefined].join(" ")}>
            <div className="title">{this.props.service.title}</div>
            {passages}
            {timeOrName} {dateString} {series} {note}
        </div>
    }
}