import { SafeHtml } from "@angular/platform-browser";

 const hsv: HSV = {
  "majorVersion": 3,
  "minorVersion": 2,
  "patchVersion": 0,
  "isDefaultConfig": false,
  "displayMode": "format",
  "doIntermediateUpdates": true,
  "timeDependencyDecimalPrecision": 0,
  "timeDependencyDecimalOffset": 0,
  "judgments": [
    {
      "threshold": 115,
      "text": "<size=130%>Perfect+ 115%A</size>%B %C %A",
      "color": [
        1.0,
        1.0,
        1.0,
        1.0
      ],
      "fade": false
    },
    {
      "threshold": 114,
      "text": "<size=130%>Perfect+ 114%A</size>%B %C %A",
      "color": [
        1.0,
        0.5,
        1.0,
        1.0
      ],
      "fade": true
    },
    {
      "threshold": 112,
      "text":  "<size=120%>%s</size>%B %C %A",
      "color": [
        1.0,
        0.0,
        1.0,
        1.0
      ],
      "fade": false
    },
    {
      "threshold": 107,
      "text":  "<size=120%>%s</size>%B %C %A",
      "color": [
        0.0,
        1.0,
        1.0,
        1.0
      ],
      "fade": false
    },
    {
      "threshold": 101,
      "text": "<size=80%>%B%A</size>%n%s",
      "color": [
        1.0,
        0.980392158,
        0.0,
        1.0
      ],
      "fade": false
    },
    {
      "threshold": 100,
      "text": "<size=80%>%B%A</size>%n%s",
      "color": [
        1.0,
        0.0,
        0.0,
        1.0
      ],
      "fade": false
    },
    {
      "threshold": 0,
      "text": "<size=80%>%B%A</size>%n%s",
      "color": [
        1.0,
        0.0,
        0.0,
        1.0
      ],
      "fade": false
    }
  ],
  "beforeCutAngleJudgments": [
    {
      "threshold": 70,
      "text": ""
    },
    {
      "threshold": 0,
      "text": "B"
    }
  ],
  "accuracyJudgments": [
    {
      "threshold": 15,
      "text": ""
    },
    {
      "threshold": 0,
      "text": ""
    }
  ],
  "afterCutAngleJudgments": [
    {
      "threshold": 30,
      "text": ""
    },
    {
      "threshold": 0,
      "text": "A"
    }
  ]
}


export interface HSV {
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  isDefaultConfig: boolean;
  displayMode: string;
  doIntermediateUpdates: boolean;
  timeDependencyDecimalPrecision: number;
  timeDependencyDecimalOffset: number;
  judgments: Judgement[];
  beforeCutAngleJudgments: BeforeCutAngleJudgment[];
  accuracyJudgments: AccuracyJudgment[];
  afterCutAngleJudgments: AfterCutAngleJudgment[];
}

export interface Judgement {
  threshold: number;
  text: string;
  color: number[];
  fade: boolean;

  innerHTML_Example?: SafeHtml;
  innerHTML_High?: SafeHtml;
  innerHTML_Low?: SafeHtml;
}

interface BeforeCutAngleJudgment {
  threshold: number;
  text: string;
}

interface AccuracyJudgment {
  threshold: number;
  text: string;
}

interface AfterCutAngleJudgment {
  threshold: number;
  text: string;
}
