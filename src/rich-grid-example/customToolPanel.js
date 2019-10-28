import Vue from "vue";
export default Vue.extend({
  template: `
    <div style="text-align: center">
      <span>
        <h2>
          <i class="fa fa-calculator"></i> Custom Stats
        </h2>
        <dl style="font-size: large; padding: 30px 40px 10px 30px">
          <dt style="padding-bottom: 15px">
            {{ IT_SKILLS[0]}}:
            <b>{{ android }}</b>
          </dt>
          <dt style="padding-bottom: 15px">
            {{ IT_SKILLS[1]}}:
            <b>{{ css }}</b>
          </dt>
          <dt style="padding-bottom: 15px">
            {{ IT_SKILLS[2]}}:
            <b>{{ html5 }}</b>
          </dt>
          <dt style="padding-bottom: 15px">
            {{ IT_SKILLS[3]}}:
            <b>{{ mac }}</b>
          </dt>
          <dt style="padding-bottom: 15px">
            {{ IT_SKILLS[4]}}:
            <b>{{ windows }}</b>
          </dt>
        </dl>
      </span>
    </div>
  `,
  data() {
    return {
      android: 0,
      css: 0,
      html5: 0,
      mac: 0,
      windows: 0,
      IT_SKILLS: ["android", "css", "html5", "mac", "windows"]
    };
  },
  methods: {
    renderStats() {
      this.params.api.forEachNode(rowNode => {
        const data = rowNode.data;
        if (data.skills.android) {
          this.android++;
        }
        if (data.skills.css) {
          this.css++;
        }
        if (data.skills.html5) {
          this.html5++;
        }
        if (data.skills.mac) {
          this.mac++;
        }
        if (data.skills.windows) {
          this.windows++;
        }
      });
    }
  },
  created() {
    this.params.api.addEventListener(
      "modelUpdated",
      this.renderStats.bind(this)
    );
  }
});
