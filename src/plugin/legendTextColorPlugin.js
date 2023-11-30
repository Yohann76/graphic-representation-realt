const legendTextColorPlugin = {
  id: 'legendTextColor',
  beforeDraw: function (chart) {
    const ctx = chart.ctx;
    const legend = chart.legend;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = legend.options.labels.font;
    legend.legendItems.forEach((legendItem) => {
      const text = legendItem.text;
      const x = legendItem.x + legendItem.width + 5;
      const y = legendItem.y + legendItem.height / 2;
      ctx.fillText(text, x, y);
    });
  },
};

export default legendTextColorPlugin;
