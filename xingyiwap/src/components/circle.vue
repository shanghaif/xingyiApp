<template>
  <svg style="width: 100%; height: 170px" :viewBox="`0 0 ${doule*radius + srtokeWidth + 10} ${radius + srtokeWidth + 10}`">
    <path
      :d="`M ${srtokeWidth/2 + offsetValue} ${radius + srtokeWidth/2 + offsetValue} a ${radius} ${radius} 0 1 1 ${radius * doule} 0`"
      :stroke-width="srtokeWidth"
      :stroke="emptyColor"
      id="path2"
      fill="none"
      stroke-linecap="round"
    ></path>
    <path
      :d="`M ${ srtokeWidth/2 + offsetValue} ${radius + srtokeWidth/2 + offsetValue} a ${radius} ${radius} 0 1 1 ${radius * doule} 0`"
      :stroke-width="srtokeWidth"
      :stroke="valueColor"
      fill="none"
      id="path1"
      stroke-linecap="round"
      :stroke-dasharray="strokeDasharray"
      :stroke-dashoffset="strokeDashoffset"
    >
      <animate
        attributeName="stroke-dashoffset"
        :dur="`${durTime}ms`"
        fill="freeze"
        :from="strokeDasharray"
        :to="strokeDashoffset"
      >
      </animate>
    </path>
    <defs>
      <path
        :d="`M ${srtokeWidth/2 + 5} ${radius + srtokeWidth/2 + offsetValue} a ${radius+2} ${radius+2} 0 1 1 ${radius * doule + 4} 0`"
        id="textPath"
      ></path>
    </defs>
    <text :x="(strokeDasharray-strokeDashoffset)-pollutionLevel.length*5" y="20" style="fill:#F5F5F5;font-size: 6px;">
      <textPath xlink:href="#textPath">{{pollutionLevel || '--'}}</textPath>
    </text>
    <g stroke="#FF7E00" stroke-width="1.2" fill="#FF7E00">
      <circle
        fill-opacity="0.5"
        :cx="`${ srtokeWidth/2 + offsetValue}`" :cy="`${radius + srtokeWidth/2 + offsetValue}`"
        r="1.2"/>
    </g>
    <g stroke="#BCD6F3" stroke-width="1.2" fill="#FF7E00">
      <circle
        fill="#BCD6F3"
        fill-opacity="0.5"
        :cx="`${radius * doule + offsetValue + 1.2}`" :cy="`${radius + srtokeWidth/2 + offsetValue}`"
        r="1.2"/>
    </g>
  </svg>
</template>
<script>
  export default {
    data () {
      return {
        defaultDurTime: 1200,
        defaultEmptyColor: 'rgba(255,255,255,0.6)',
        defaultNegativeColor: '#FF4456',
        doule: 1.98,
        // defaultPositiveColor: '#56D5E4',
        defaultPositiveColor: '#FF7E00',
        defaultSrtokeWidth: 10,
        defaultRadius: 55,
        radiusWidth: 0,
        offsetValue: 7,
      }
    },
    props: ['options', 'value', 'pollutionLevel'],
    mounted() {
      this.radiusWidth = document.getElementById("path2").getTotalLength()
    },
    computed: {
      durTime () {
        return this.options
          ? this.options.durTime || this.defaultDurTime
          : this.defaultDurTime
      },
      radius () {
        return this.options
          ? this.options.radius || this.defaultRadius
          : this.defaultRadius
      },
      emptyColor () {
        return this.options
          ? this.options.emptyColor || this.defaultEmptyColor
          : this.defaultEmptyColor
      },
      srtokeWidth () {
        return this.options
          ? this.options.srtokeWidth || this.defaultSrtokeWidth
          : this.defaultSrtokeWidth
      },
      valueColor () {
        if (this.value < 0) {
          return this.options
            ? this.options.negativeColor || this.defaultNegativeColor
            : this.defaultNegativeColor
        } else {
          return this.options
            ? this.options.positiveColor || this.defaultPositiveColor
            : this.defaultPositiveColor
        }
      },
      strokeDasharray () {
        return this.radiusWidth;
      },
      strokeDashoffset () {
        return Math.abs(this.strokeDasharray - this.strokeDasharray * this.value)
      }
    }
  }
</script>
