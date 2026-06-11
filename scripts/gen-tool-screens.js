const fs = require('fs');
const path = require('path');

const tools = [
  ['SuperRealisticScreen', 'super_realistic', '超级写实', '让任何图片更真实'],
  ['HDRepairScreen', 'hd_repair', '高清修复', '超清放大修复'],
  ['LegEnhanceScreen', 'leg_enhance', '丰腿', '蜜腿塑形'],
  ['MuscleScreen', 'muscle', '肌肉', '力量臂增强'],
  ['MuscleEnhanceScreen', 'muscle_enhance', '肌肉增强', 'AI 肱二头肌增大'],
  ['ProportionScreen', 'proportion', '比例调整', 'AI纤臂塑形'],
  ['LipPlumpScreen', 'lip_plump', '丰唇', '饱满嘴唇'],
  ['ObjectRemovalScreen', 'obj_remove', '物体消除', '智能擦除物体'],
  ['BackgroundRemovalScreen', 'bg_remove', '背景移除', '一键抠图换背景'],
  ['HDReshapeScreen', 'reshape', '重塑', '智能身材重塑'],
  ['BeautyScreen', 'beauty', '美颜', '自然美颜效果'],
  ['HairDyeScreen', 'hair_dye', '染发', 'AI 智能染发'],
  ['JawlineScreen', 'jawline', '下颌轮廓', '精致下颌线'],
  ['HairSmoothScreen', 'hair_smooth', '发质顺滑', '顺滑发质效果'],
  ['HairRepairScreen', 'hair_repair', '发质修复', '修复受损发质'],
  ['ColorGradeScreen', 'color_grade', '调色', '专业色彩调校'],
  ['FilterScreen', 'filter', '滤镜', '精选风格滤镜'],
  ['AIEditScreen', 'ai_edit', 'AI 编辑', '智能图片编辑'],
];

const dir = path.join(__dirname, '..', 'src', 'screens', 'ai-tools');

for (const [file, toolType, title, subtitle] of tools) {
  const content = `import React from 'react';
import ToolScreenLayout from '../../components/ToolScreenLayout';

export default function ${file}() {
  return (
    <ToolScreenLayout
      title="${title}"
      toolType="${toolType}"
      introSubtitle="${subtitle}"
    />
  );
}
`;
  fs.writeFileSync(path.join(dir, `${file}.tsx`), content);
}

console.log('Updated', tools.length, 'tool screens');
