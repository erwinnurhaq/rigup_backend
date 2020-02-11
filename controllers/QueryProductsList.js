module.exports = {

    acc: `SELECT acc.id, at.type, ab.brand, acc.name, acc.desc, acc.price FROM acc
    JOIN acc_type at ON acc.acc_type_id = at.id
    JOIN acc_brand ab ON acc.acc_brand_id = ab.id`,

    case: `SELECT c.id, cb.brand, ms.size, c.name, c.desc, c.price, c.gpu_max_length FROM rigdb.case c
    JOIN case_brand cb ON c.case_brand_id = cb.id
    JOIN mobo_size ms ON c.mobo_size_id = ms.id`,

    gpu: `SELECT g.id, gbr.brand, gm.manufacture, g.name, g.desc, g.gpu_memory_size, g.price, g.gpu_length FROM gpu g
    JOIN gpu_brand gbr ON g.gpu_brand_id = gbr.id
    JOIN gpu_manufacture gm ON g.gpu_manufacture_id=gm.id`,

    memory: `SELECT m.id, mb.brand, m.name, m.size, m.channel, m.memory_speed, m.price FROM memory m
    JOIN memory_brand mb ON m.memory_brand_id = mb.id`,

    mobo: `SELECT m.id, pb.brand, ps.socket, mc.chipset, mb.brand, m.name, m.desc, m.price, ms.size, m.memory_max_speed FROM mobo m
    JOIN processor_brand pb ON m.processor_brand_id = pb.id
    JOIN processor_socket ps ON m.processor_socket_id = ps.id
    JOIN mobo_chipset mc ON m.mobo_chipset_id = mc.id
    JOIN mobo_brand mb ON m.mobo_brand_id = mb.id
    JOIN mobo_size ms ON m.mobo_size_id = ms.id`,

    processor: `SELECT p.id, pb.brand, ps.socket, pg.gen, p.name, p.desc, p.price, p.tdp, pgr.graphic FROM processor p
    JOIN processor_brand pb ON p.processor_brand_id=pb.id
    JOIN processor_socket ps ON p.processor_socket_id=ps.id
    JOIN processor_gen pg ON p.processor_gen_id=pg.id
    LEFT JOIN processor_graphic pgr ON p.processor_graphic_id=pgr.id`,

    psu: `SELECT p.id, pb.brand, p.name, p.power, pe.efficiency, p.price FROM psu p
    JOIN psu_brand pb ON p.psu_brand_id=pb.id
    JOIN psu_efficiency pe ON p.psu_efficiency_id=pe.id`,

    storage: `SELECT s.id, st.type, sb.brand, s.name, s.desc, ss.size, s.price FROM storage s
    JOIN storage_type st ON s.storage_type_id = st.id
    JOIN storage_brand sb ON s.storage_brand_id=sb.id
    JOIN storage_size ss ON s.storage_size_id=ss.id`

}