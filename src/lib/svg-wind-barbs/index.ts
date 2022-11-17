import { svg, TemplateResult } from "lit";

const WIND_BARB_0 = svg`<path class="svg-wb-fill" d="M125,120c2.762,0,5,2.239,5,5c0,2.762-2.238,5-5,5c-2.761,0-5-2.238-5-5C120,122.239,122.239,120,125,120z"/><path fill="none" class="svg-wb-stroke" stroke-width="2" d="M125,115c5.523,0,10,4.477,10,10c0,5.523-4.477,10-10,10 c-5.523,0-10-4.477-10-10C115,119.477,119.477,115,125,115z "/>`;
const WIND_BARB_2 = svg`<path class="svg-wb" d="M125,112V76 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_5 = svg`<path class="svg-wb" d="M125,112V76 M125,89l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_10 = svg`<path class="svg-wb" d="M125,112V89 M125,89l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_15 = svg`<path class="svg-wb" d="M125,112V89 M125,89l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_20 = svg`<path class="svg-wb" d="M125,112V89 M125,89l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_25 = svg`<path class="svg-wb" d="M125,112V79 M125,79l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_30 = svg`<path class="svg-wb" d="M125,112V79 M125,79l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_35 = svg`<path class="svg-wb" d="M125,112V69 M125,69l14-14 M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_40 = svg`<path class="svg-wb" d="M125,112V69 M125,69l14-14 M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_45 = svg`<path class="svg-wb" d="M125,112V59 M125,59l14-14 M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14 L125,125z"/>`;
const WIND_BARB_50 = svg`<path class="svg-wb" d="M125,112V76 M125,76h14l-14,14V76z M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_55 = svg`<path class="svg-wb" d="M125,112V76 M125,76h14l-14,14V76z M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_60 = svg`<path class="svg-wb" d="M125,112V76 M125,76h14l-14,14V76z M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_65 = svg`<path class="svg-wb" d="M125,112V66 M125,66h14l-14,14V66z M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_70 = svg`<path class="svg-wb" d="M125,112V66 M125,66h14l-14,14V66z M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_75 = svg`<path class="svg-wb" d="M125,112V56 M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_80 = svg`<path class="svg-wb" d="M125,112V56 M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_85 = svg`<path class="svg-wb" d="M125,112V46 M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1 h-14L125,125z"/>`;
const WIND_BARB_90 = svg`<path class="svg-wb" d="M125,112V46 M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1 h-14L125,125z"/>`;
const WIND_BARB_95 = svg`<path class="svg-wb" d="M125,112V36 M125,36h14l-14,14V36z M125,60l14-14 M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_100 = svg`<path class="svg-wb" d="M125,112V62 M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_105 = svg`<path class="svg-wb" d="M125,112V62 M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_110 = svg`<path class="svg-wb" d="M125,112V62 M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_115 = svg`<path class="svg-wb" d="M125,112V52 M125,52h14l-14,14V52z M125,66h14l-14,14V66z M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14 L125,125z"/>`;
const WIND_BARB_120 = svg`<path class="svg-wb" d="M125,112V52 M125,52h14l-14,14V52z M125,66h14l-14,14V66z M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14 L125,125z"/>`;
const WIND_BARB_125 = svg`<path class="svg-wb" d="M125,112V42 M125,42h14l-14,14V42z M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125 l7-12.1h-14L125,125z"/>`;
const WIND_BARB_130 = svg`<path class="svg-wb" d="M125,112V42 M125,42h14l-14,14V42z M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125 l7-12.1h-14L125,125z"/>`;
const WIND_BARB_135 = svg`<path class="svg-wb" d="M125,112V32 M125,32h14l-14,14V32z M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100 l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_140 = svg`<path class="svg-wb" d="M125,112V32 M125,32h14l-14,14V32z M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100 l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_145 = svg`<path class="svg-wb" d="M125,112V22 M125,22h14l-14,14V22z M125,36h14l-14,14V36z M125,60l14-14 M125,70l14-14 M125,80l14-14 M125,90 l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_150 = svg`<path class="svg-wb" d="M125,112V48 M125,48h14l-14,14V48z M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_155 = svg`<path class="svg-wb" d="M125,112V48 M125,48h14l-14,14V48z M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,100l7-7 M125,125l7-12.1 h-14L125,125z"/>`;
const WIND_BARB_160 = svg`<path class="svg-wb" d="M125,112V48 M125,48h14l-14,14V48z M125,62h14l-14,14V62z M125,76h14l-14,14V76z M125,100l14-14 M125,125 l7-12.1h-14L125,125z"/>`;
const WIND_BARB_165 = svg`<path class="svg-wb" d="M125,112V38 M125,38h14l-14,14V38z M125,52h14l-14,14V52z M125,66h14l-14,14V66z M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_170 = svg`<path class="svg-wb" d="M125,112V38 M125,38h14l-14,14V38z M125,52h14l-14,14V52z M125,66h14l-14,14V66z M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_175 = svg`<path class="svg-wb" d="M125,112V28 M125,28h14l-14,14V28z M125,42h14l-14,14V42z M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_180 = svg`<path class="svg-wb" d="M125,112V28 M125,28h14l-14,14V28z M125,42h14l-14,14V42z M125,56h14l-14,14V56z M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_185 = svg`<path class="svg-wb" d="M125,112V18 M125,18h14l-14,14V18z M125,32h14l-14,14V32z M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l7-7 M125,125l7-12.1h-14L125,125z"/>`;
const WIND_BARB_190 = svg`<path class="svg-wb" d="M125,112V18 M125,18h14l-14,14V18z M125,32h14l-14,14V32z M125,46h14l-14,14V46z M125,70l14-14 M125,80l14-14 M125,90l14-14 M125,100l14-14 M125,125l7-12.1h-14L125,125z"/>`;

/**
 * Get SVG barb for the specified wind speed
 * @param windSpeed Wind speed in meters per second
 * @returns Lit template of SVG path for barb
 */
export function getWindBarbSVG(windSpeed: number): TemplateResult<2> {
  if (windSpeed >= 0.0 && windSpeed < 1.0) return WIND_BARB_0;
  else if (windSpeed >= 1.0 && windSpeed < 2.5) return WIND_BARB_2;
  else if (windSpeed >= 2.5 && windSpeed < 5.0) return WIND_BARB_5;
  else if (windSpeed >= 5.0 && windSpeed < 7.5) return WIND_BARB_10;
  else if (windSpeed >= 7.5 && windSpeed < 10.0) return WIND_BARB_15;
  else if (windSpeed >= 10.0 && windSpeed < 12.5) return WIND_BARB_20;
  else if (windSpeed >= 12.5 && windSpeed < 15.0) return WIND_BARB_25;
  else if (windSpeed >= 15.0 && windSpeed < 17.5) return WIND_BARB_30;
  else if (windSpeed >= 17.5 && windSpeed < 20.0) return WIND_BARB_35;
  else if (windSpeed >= 20.0 && windSpeed < 22.5) return WIND_BARB_40;
  else if (windSpeed >= 22.5 && windSpeed < 25.0) return WIND_BARB_45;
  else if (windSpeed >= 25.0 && windSpeed < 27.5) return WIND_BARB_50;
  else if (windSpeed >= 27.5 && windSpeed < 30.0) return WIND_BARB_55;
  else if (windSpeed >= 30.0 && windSpeed < 32.5) return WIND_BARB_60;
  else if (windSpeed >= 32.5 && windSpeed < 35.0) return WIND_BARB_65;
  else if (windSpeed >= 35.0 && windSpeed < 37.5) return WIND_BARB_70;
  else if (windSpeed >= 37.5 && windSpeed < 40.0) return WIND_BARB_75;
  else if (windSpeed >= 40.0 && windSpeed < 42.5) return WIND_BARB_80;
  else if (windSpeed >= 42.5 && windSpeed < 45.0) return WIND_BARB_85;
  else if (windSpeed >= 45.0 && windSpeed < 47.5) return WIND_BARB_90;
  else if (windSpeed >= 47.5 && windSpeed < 50.0) return WIND_BARB_95;
  else if (windSpeed >= 50.0 && windSpeed < 52.5) return WIND_BARB_100;
  else if (windSpeed >= 52.5 && windSpeed < 55.0) return WIND_BARB_105;
  else if (windSpeed >= 55.0 && windSpeed < 57.5) return WIND_BARB_110;
  else if (windSpeed >= 57.5 && windSpeed < 60.0) return WIND_BARB_115;
  else if (windSpeed >= 60.0 && windSpeed < 62.5) return WIND_BARB_120;
  else if (windSpeed >= 62.5 && windSpeed < 65.0) return WIND_BARB_125;
  else if (windSpeed >= 65.0 && windSpeed < 67.5) return WIND_BARB_130;
  else if (windSpeed >= 67.5 && windSpeed < 70.0) return WIND_BARB_135;
  else if (windSpeed >= 70.0 && windSpeed < 72.5) return WIND_BARB_140;
  else if (windSpeed >= 72.5 && windSpeed < 75.0) return WIND_BARB_145;
  else if (windSpeed >= 75.0 && windSpeed < 77.5) return WIND_BARB_150;
  else if (windSpeed >= 77.5 && windSpeed < 80.0) return WIND_BARB_155;
  else if (windSpeed >= 80.0 && windSpeed < 82.5) return WIND_BARB_160;
  else if (windSpeed >= 82.5 && windSpeed < 85.0) return WIND_BARB_165;
  else if (windSpeed >= 85.0 && windSpeed < 87.5) return WIND_BARB_170;
  else if (windSpeed >= 87.5 && windSpeed < 90.0) return WIND_BARB_175;
  else if (windSpeed >= 90.0 && windSpeed < 92.5) return WIND_BARB_180;
  else if (windSpeed >= 92.5 && windSpeed < 95.0) return WIND_BARB_185;
  else if (windSpeed >= 95.0 && windSpeed < 97.5) return WIND_BARB_190;
  else return WIND_BARB_0;
}
